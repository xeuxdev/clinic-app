import { body, param, validationResult } from "express-validator";
import { pool } from "../db/init_db.js";

// Add Appointment
export const addAppointment = [
  body('email').isEmail().withMessage('Email is required').trim().escape(),
  body('profile_id').notEmpty().withMessage('Profile id is required').isInt({ min: 1 }).toInt(),
  body('appointment_date').notEmpty().withMessage('Appointment date is required').isISO8601().toDate(),
  body('doctor_id').notEmpty().withMessage('Doctor id is required').isInt({ min: 1 }).toInt(),
  body('notes').optional().trim().escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { profile_id, appointment_date, doctor_id, email, notes } = req.body;

    try {
      //  Check if patient exists
      const patient_account = await pool.query(
        `SELECT * FROM auth.accounts WHERE email = $1`,
        [email]
      );

      if (patient_account.rowCount === 0) {
        return res.status(400).json({
          success: false,
          message: 'Patient account not found',
        });
      }

      //  Insert appointment
      const appointment = await pool.query(
        `INSERT INTO appointment.bookings
          (profile_id, appointment_date, doctor_id, notes)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [profile_id, appointment_date, doctor_id, notes || null]
      );

      res.status(201).json({
        success: true,
        message: 'Appointment added successfully',
        appointment: appointment.rows[0],
      });
    } catch (error) {
      console.error('❌ Error booking appointment:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },
];
// List All Appointments
export const listAppointment = async (req, res) => {
  try {
    const bookings = await pool.query(`SELECT * FROM appointment.bookings ORDER BY appointment_date ASC`);

    if (bookings.rowCount === 0) {
      return res.status(200).json({
        success: true,
        message: "No bookings found",
        bookings: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: 'All bookings',
      bookings: bookings.rows,
    });
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// cancel appointment
export const cancelAppointment = [
  param('appointment_id')
    .isInt({ min: 1 })
    .withMessage('Invalid appointment ID'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    try {
      const { appointment_id } = req.params;

      // Check if appointment exists
      const booking = await pool.query(
        `SELECT * FROM appointment.bookings WHERE appointment_id = $1`,
        [appointment_id]
      );

      if (booking.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      // Cancel appointment
      const result = await pool.query(
        `UPDATE appointment.bookings
         SET status = 'cancelled'
         WHERE appointment_id = $1
         RETURNING *`,
        [appointment_id]
      );

      return res.status(200).json({
        success: true,
        message: 'Appointment cancelled successfully',
        appointment: result.rows[0],
      });

    } catch (error) {
      console.error("❌ Error cancelling appointment:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },

];
export const rescheduleAppointment = [
  param("appointment_id").isInt({ min: 1 }).withMessage("Invalid appointment ID"),
  body("new_date").notEmpty().withMessage("New appointment date is required").isDate(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { appointment_id } = req.params;
    const { new_date } = req.body;

    try {
      const booking = await pool.query(
        `SELECT * FROM appointment.bookings WHERE appointment_id = $1`,
        [appointment_id]
      );
      if (booking.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      const result = await pool.query(
        `UPDATE appointment.bookings
         SET status = 'rescheduled', appointment_date = $1
         WHERE appointment_id = $2
         RETURNING *`,
        [new_date, appointment_id]
      );

      return res.status(200).json({
        success: true,
        message: "Appointment rescheduled successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("❌ Error rescheduling appointment:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];
//  Mark Appointment In-Progress
export const startAppointment = [
  param("appointment_id").isInt({ min: 1 }).withMessage("Invalid appointment ID"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { appointment_id } = req.params;

    try {
      const result = await pool.query(
        `UPDATE appointment.bookings
         SET status = 'in_progress'
         WHERE appointment_id = $1
         RETURNING *`,
        [appointment_id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Appointment marked as in progress",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("❌ Error starting appointment:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];
// Complete Appointment
export const completeAppointment = [
  param("appointment_id").isInt({ min: 1 }).withMessage("Invalid appointment ID"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { appointment_id } = req.params;

    try {
      const result = await pool.query(
        `UPDATE appointment.bookings
         SET status = 'completed'
         WHERE appointment_id = $1
         RETURNING *`,
        [appointment_id]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Appointment completed successfully",
        data: result.rows[0],
      });
    } catch (error) {
      console.error("❌ Error completing appointment:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];