import { body, param, validationResult } from "express-validator";
import { pool } from "../db/init_db.js";
import bcrypt from "bcrypt";
import { generateOTP } from "../util/generateCode.js";
import { generateRandomToken } from "../util/generateRandomToken.js";
import { setSession } from "../util/setSession.js";
import { sendEmail } from "../mail/email.config.js";
import { emailTemplates } from "../mail/templates.js";

export const userLogin = [
  // Validation rules
  body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  // Controller
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }
    const { email, password } = req.body;
    try {
      // Check if account exists
      const userResult = await pool.query(
        `SELECT * FROM auth.accounts WHERE email = $1`,
        [email]
      );
      if (userResult.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Invalid email or password",
        });
      }
      const dbUser = userResult.rows[0];
      // Compare passwords
      const isPasswordValid = await bcrypt.compare(password, dbUser.password);
      if (!isPasswordValid) {
        return res.status(400).json({
          success: false,
          message: "Invalid email or password",
        });
      }
      // Fetch user details
      const loggedInUser = await pool.query(
        `SELECT * FROM "user".profile WHERE account_id = $1`,
        [dbUser.id]
      );
      setSession(loggedInUser.rows[0].id);
      res.status(200).json({
        success: true,
        message: "User logged in",
        user: loggedInUser.rows[0],
      });
    } catch (error) {
      console.error("Error trying to login user:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];
export const patientRegister = [
  // validation rules
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

  body("date_of_birth")
    .notEmpty().withMessage("Date of birth is required")
    .isDate({ format: "YYYY-MM-DD", strictMode: true })
    .withMessage("Date of birth must be in YYYY-MM-DD format"),

  body("blood_group")
    .notEmpty().withMessage("Blood group is required")
    .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .withMessage("Invalid blood group"),

  body("medical_condition")
    .optional({ checkFalsy: true }) // allow empty/null
    .isLength({ max: 255 }).withMessage("Medical condition must be 255 characters or less")
    .escape(),

  body("current_medication")
    .optional({ checkFalsy: true })
    .isLength({ max: 255 }).withMessage("Current medication must be 255 characters or less")
    .escape(),

  body("known_allergies")
    .optional({ checkFalsy: true })
    .isLength({ max: 255 }).withMessage("Known allergies must be 255 characters or less")
    .escape(),


  // controller
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const {
      email, password, phone_number, full_name,
      date_of_birth, blood_group, medical_condition,
      current_medication, known_allergies
    } = req.body;

    try {
      // Check if email/account exists
      const existingUser = await pool.query(
        `SELECT * FROM auth.accounts WHERE email = $1`,
        [email]
      );


      if (existingUser.rowCount > 0) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const verification_code = generateOTP(6);
      const verification_code_expiry = new Date(Date.now() + 15 * 60 * 1000);

      // Create account
      const newAccount = await pool.query(
        `INSERT INTO auth.accounts (email, password, verification_code, verification_code_expiry)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [email, hashedPassword, verification_code, verification_code_expiry]
      );

      // Create profile
      const newProfile = await pool.query(
        `INSERT INTO "user".profile (
           account_id, full_name, phone_number, date_of_birth,
           blood_group, medical_condition, current_medication, known_allergies
         ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
        [
          newAccount.rows[0].id,
          full_name,
          phone_number,
          date_of_birth,
          blood_group,
          medical_condition || null,
          current_medication || null,
          known_allergies || null
        ]
      );
      setSession(newProfile.rows[0].id)
      await sendEmail(newAccount.rows[0].email, emailTemplates.welcome(newProfile.rows[0].full_name))
      res.status(201).json({
        success: true,
        message: "Account created",
        user: newProfile.rows[0]
      });

    } catch (error) {
      console.error("Error registering user:", error.message);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
];
export const requestPasswordResetLink = [
  body("email")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),

  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: error.array()[0].msg
      });
    }

    const { email } = req.body;

    try {
      // Check if user exists
      const user = await pool.query(
        `SELECT * FROM auth.accounts WHERE email = $1`,
        [email]
      );

      if (user.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "No user with this email"
        });
      }

      // Generate token and expiry
      const reset_password_token = generateRandomToken();
      const reset_password_token_expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      // Update token in DB
      await pool.query(
        `UPDATE auth.accounts
         SET reset_password_token = $1, reset_password_token_expiry = $2
         WHERE email = $3`,
        [reset_password_token, reset_password_token_expiry, email]
      );

      // Send reset link via email
      const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${reset_password_token}`;
      await sendEmail(email, emailTemplates.requestPassword(user.rows[0].full_name, resetLink));


      return res.status(200).json({
        success: true,
        message: "Password reset link sent to your email"
      });

    } catch (error) {
      console.error("Password reset error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
];
export const changePassword = [
  param('reset_password_token').isString(),
  body('new_password')
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { reset_password_token } = req.params;
    const { new_password } = req.body;

    try {
      // Find account with token
      const accountResult = await pool.query(
        `SELECT * FROM auth.accounts WHERE reset_password_token=$1`,
        [reset_password_token]
      );

      if (
        accountResult.rowCount === 0 ||
        new Date(accountResult.rows[0].reset_password_token_expiry) < new Date()
      ) {
        return res.status(404).json({
          success: false,
          message: "Invalid or expired token"
        });
      }

      const account = accountResult.rows[0];

      // Hash new password
      const hashedPassword = await bcrypt.hash(new_password, 10);

      // Update account and clear token
      await pool.query(
        `UPDATE auth.accounts
         SET password=$1, reset_password_token=NULL, reset_password_token_expiry=NULL
         WHERE id=$2`,
        [hashedPassword, account.id]
      );

      // Get profile
      const profileResult = await pool.query(
        `SELECT * FROM "user".profile WHERE account_id=$1`,
        [account.id]
      );

      // Send success email
      await sendEmail(
        account.email,
        emailTemplates.resetSuccess(profileResult.rows[0].full_name)
      );

      res.status(200).json({
        success: true,
        message: "Password reset successful"
      });

    } catch (error) {
      console.error("Password change error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
];
export const userRegister = [
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

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg
      });
    }

    const { email, password, phone_number, full_name } = req.body;

    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert account with role 'receptionist'
      const newAccount = await pool.query(
        `INSERT INTO auth.accounts (email, password, role)
         VALUES ($1, $2, $3) RETURNING *`,
        [email, hashedPassword, 'receptionist']
      );

      // Insert profile
      const newProfile = await pool.query(
        `INSERT INTO "user".profile (account_id, full_name, phone_number)
         VALUES ($1, $2, $3) RETURNING *`,
        [newAccount.rows[0].id, full_name, phone_number]
      );

      return res.status(201).json({
        success: true,
        message: "Receptionist account created successfully",
        user: newProfile.rows[0]
      });

    } catch (error) {
      console.error(" Error registering receptionist:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
];
