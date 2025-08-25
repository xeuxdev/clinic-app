import { body, param, validationResult } from "express-validator";
import { pool } from "../db/init_db.js";
import bcrypt from "bcrypt";

// --------------------------- ADD DOCTOR / RECEPTIONIST ---------------------------
export const addDoctor_receptionist = [
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

  body("role")
    .notEmpty().withMessage("Role is required")
    .trim().escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()[0].msg });
    }

    try {
      const { full_name, email, phone_number, password, role } = req.body;

      // Check if email already exists
      const existingUser = await pool.query(
        "SELECT * FROM auth.accounts WHERE email = $1",
        [email]
      );
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert into accounts table
      const newAccount = await pool.query(
        `INSERT INTO auth.accounts (full_name, email, phone_number, password, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [full_name, email, phone_number, hashedPassword, role]
      );

      res.status(201).json(newAccount.rows[0]);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
];

// --------------------------- GET DOCTOR / RECEPTIONIST ---------------------------
export const get_doctor_receptionist = [
  param("role").trim().notEmpty().withMessage("role is required"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const role = req.params.role;

    try {
      const doctorResult = await pool.query(
        "SELECT * FROM auth.accounts WHERE role = $1",
        [role]
      );

      if (doctorResult.rows.length === 0) {
        return res.status(404).json({ message: `No ${role} found` });
      }

      // Collect account ids
      const accountIds = doctorResult.rows.map((doc) => doc.id);

      // Fetch profiles for all those accounts
      const profileResult = await pool.query(
        `SELECT * FROM "user".profile WHERE account_id = ANY($1::uuid[])`,
        [accountIds]
      );

      return res.status(200).json({
        success: true,
        accounts: doctorResult.rows,
        profiles: profileResult.rows,
      });
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
];
