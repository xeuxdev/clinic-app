import { body, param, validationResult } from "express-validator"
import { pool } from "../db/init_db";
import bcrypt from "bcrypt"

export const addDoctor_receptionist =[
 body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

  body("phone_number")
    .notEmpty().withMessage("Phone number is required")
    .isMobilePhone().withMessage("Invalid phone number"),
  body("full_name")
    .notEmpty().withMessage("Full name is required")
    .trim().escape(),
  body("role").withMessage("Role is required").trim().escape(),
    body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  async(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() })
    }
    try {
      const { full_name, email, phone_number, password, role } = req.body;
     // check if there is a user with  same email
     const existingUser = await pool.query("SELECT * FROM auth.accounts WHERE email = $1", [email]);
     if (existingUser.rows.length > 0){
      return res.status(400).json({ message: "Email already exists" });
     }

     // hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
     const newAccount = await pool.query("INSERT INTO auth.accounts (full_name, email, phone_number, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *", [full_name, email, phone_number, hashedPassword, role]);
      res.status(201).json(newAccount.rows[0]);
    } catch (error) {
      console.log(error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
]

export const get_doctor_receptionist = [
  param("role").trim().notEmpty().withMessage("role is required"),
  async(req, res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).json({ errors: errors.array() })
    }
    const role = req.params.role;
    try {
      const doctor = await pool.query("SELECT * FROM auth.accounts WHERE role = $1", [role]);
      const doctor_profile = await pool.query(`SELECT * FROM "user".profile WHERE account_id =$1`,[doctor.rows[0].id])
      if(doctor.rows.length === 0){
        return res.status(404).json({
           message: "No doctor found"
          });
      }
      return res.status(200).json({
        success:true,
        doctor_profile
      })
    }catch(error){
      console.log(error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
]