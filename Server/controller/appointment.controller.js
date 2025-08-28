import { body, param, validationResult } from "express-validator";
import { pool } from "../db/init_db.js";

// Add Appointment
export const addAppointment = [
  body("email").isEmail().withMessage("Email is required").trim().escape(),
  body("profile_id")
    .notEmpty()
    .withMessage("Profile id is required")
    .isInt({ min: 1 })
    .toInt(),
  body("appointment_date")
    .notEmpty()
    .withMessage("Appointment date is required")
    .isISO8601()
    .toDate(),
  body("doctor_id")
    .notEmpty()
    .withMessage("Doctor id is required")
    .isInt({ min: 1 })
    .toInt(),
  body("note").optional().trim().escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { profile_id, appointment_date, doctor_id, email, note } = req.body;

    try {
      //  Check if patient exists
      const patient_account = await pool.query(
        `SELECT * FROM auth.accounts WHERE email = $1`,
        [email]
      );

      if (patient_account.rowCount === 0) {
        return res.status(400).json({
          success: false,
          message: "Patient account not found",
        });
      }

      //  Insert appointment
      const appointment = await pool.query(
        `INSERT INTO appointment.bookings
          (profile_id, appointment_date, doctor_id, note)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [profile_id, appointment_date, doctor_id, note || null]
      );

      // Fetch full appointment details (including patient and doctor DOB)
      const full = await pool.query(
        `
        SELECT
          b.*,
          pp.full_name AS patient_name,
          pp.phone_number AS patient_phone,
          pp.date_of_birth AS patient_dob,
          pp.medical_condition AS patient_medical_condition,
          pp.current_medication AS patient_current_medication,
          pp.known_allergies AS patient_known_allergies,
          pa.email AS patient_email,
          d.id AS doctor_id,
          dp.full_name AS doctor_name,
          dp.date_of_birth AS doctor_dob,
          da.email AS doctor_email
        FROM appointment.bookings b
        LEFT JOIN "user".profile pp ON b.profile_id = pp.id
        LEFT JOIN auth.accounts pa ON pp.account_id = pa.id
        LEFT JOIN doctor.details d ON b.doctor_id = d.id
        LEFT JOIN "user".profile dp ON d.account_id = dp.account_id
        LEFT JOIN auth.accounts da ON dp.account_id = da.id
        WHERE b.id = $1
        `,
        [appointment.rows[0].id]
      );

      res.status(201).json({
        success: true,
        message: "Appointment added successfully",
        appointment: full.rows[0] || appointment.rows[0],
      });
    } catch (error) {
      console.error("❌ Error booking appointment:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];

// Get by id

export const getAppointmentById = async (req, res) => {
  const { id } = req.params;

  // Validate that id is a valid integer
  const idNum = parseInt(id, 10);
  if (isNaN(idNum) || idNum <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid appointment ID. Must be a positive integer.",
    });
  }

  try {
    const appointment = await pool.query(
      `SELECT
        b.*,
        pp.full_name AS patient_name,
        pp.phone_number AS patient_phone,
        pp.date_of_birth AS patient_dob,
        pp.medical_condition AS patient_medical_condition,
        pp.current_medication AS patient_current_medication,
        pp.known_allergies AS patient_known_allergies,
        pa.email AS patient_email,
        d.id AS doctor_id,
        dp.full_name AS doctor_name,
        da.email AS doctor_email
      FROM appointment.bookings b
      LEFT JOIN "user".profile pp ON b.profile_id = pp.id
      LEFT JOIN auth.accounts pa ON pp.account_id = pa.id
      LEFT JOIN doctor.details d ON b.doctor_id = d.id
      LEFT JOIN "user".profile dp ON d.account_id = dp.account_id
      LEFT JOIN auth.accounts da ON dp.account_id = da.id
      WHERE b.id = $1`,
      [id]
    );

    if (appointment.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment details",
      appointment: appointment.rows[0],
    });
  } catch (error) {
    console.error("❌ Error fetching appointment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// List All Appointments
export const getAppointments = async (req, res) => {
  const { date, search, status, role } = req.query;

  try {
    let query = `
      SELECT
        b.*,
        pp.full_name AS patient_name,
        pp.phone_number AS patient_phone,
        pp.date_of_birth AS patient_dob,
        pp.medical_condition AS patient_medical_condition,
        pp.current_medication AS patient_current_medication,
        pp.known_allergies AS patient_known_allergies,
        pa.email AS patient_email,
        d.id AS doctor_id,
        dp.full_name AS doctor_name,
        da.email AS doctor_email
      FROM appointment.bookings b
      LEFT JOIN "user".profile pp ON b.profile_id = pp.id
      LEFT JOIN auth.accounts pa ON pp.account_id = pa.id
      LEFT JOIN doctor.details d ON b.doctor_id = d.id
      LEFT JOIN "user".profile dp ON d.account_id = dp.account_id
      LEFT JOIN auth.accounts da ON dp.account_id = da.id
    `;

    const params = [];
    const conditions = [];

    if (date) {
      if (date === "today") {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);
        conditions.push(
          `b.appointment_date BETWEEN $${params.length + 1} AND $${
            params.length + 2
          }`
        );
        params.push(startOfDay, endOfDay);
      } else {
        conditions.push(`b.appointment_date::date = $${params.length + 1}`);
        params.push(date);
      }
    }

    if (search) {
      conditions.push(`(
        dp.full_name ILIKE $${params.length + 1} OR
        pp.full_name ILIKE $${params.length + 1} OR
        b.note ILIKE $${params.length + 1}
      )`);
      params.push(`%${search}%`);
    }

    if (status) {
      conditions.push(`b.status = $${params.length + 1}`);
      params.push(status);
    }

    if (role === "doctor") {
      conditions.push(`b.paymentStatus = $${params.length + 1}`);
      params.push("paid");
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    query += " ORDER BY b.appointment_date ASC";

    const result = await pool.query(query, params);

    if (result.rowCount === 0) {
      return res.status(200).json({
        success: true,
        message: "No appointments found",
        appointments: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointments fetched successfully",
      appointments: result.rows,
    });
  } catch (error) {
    console.error("❌ Error fetching appointments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const payForAppointment = [
  param("appointment_id")
    .isInt({ min: 1 })
    .withMessage("Invalid appointment ID"),

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
      // Check if appointment exists
      const appointment = await pool.query(
        `SELECT * FROM appointment.bookings WHERE id = $1`,
        [appointment_id]
      );

      if (appointment.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      // Update paymentStatus to 'paid'
      const result = await pool.query(
        `UPDATE appointment.bookings
         SET paymentStatus = 'paid'
         WHERE id = $1
         RETURNING *`,
        [appointment_id]
      );

      return res.status(200).json({
        success: true,
        message: "Payment processed successfully",
        appointment: result.rows[0],
      });
    } catch (error) {
      console.error("❌ Error processing payment:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];

// cancel appointment
export const cancelAppointment = [
  param("appointment_id")
    .isInt({ min: 1 })
    .withMessage("Invalid appointment ID"),

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
        `SELECT * FROM appointment.bookings WHERE id = $1`,
        [appointment_id]
      );

      if (booking.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      // Cancel appointment
      const result = await pool.query(
        `UPDATE appointment.bookings
         SET status = 'cancelled'
         WHERE id = $1
         RETURNING *`,
        [appointment_id]
      );

      return res.status(200).json({
        success: true,
        message: "Appointment cancelled successfully",
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
  param("appointment_id")
    .isInt({ min: 1 })
    .withMessage("Invalid appointment ID"),
  body("new_date")
    .notEmpty()
    .withMessage("New appointment date is required")
    .isISO8601()
    .toDate(),

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
        `SELECT * FROM appointment.bookings WHERE id = $1`,
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
         WHERE id = $2
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
  param("id").isInt({ min: 1 }).withMessage("Invalid appointment ID"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { id } = req.params;

    try {
      const result = await pool.query(
        `UPDATE appointment.bookings
         SET status = 'in_progress'
         WHERE id = $1
         RETURNING *`,
        [id]
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
  param("appointment_id")
    .isInt({ min: 1 })
    .withMessage("Invalid appointment ID"),

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
         WHERE id = $1
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

export const saveConsultation = [
  body("appointment_id")
    .notEmpty()
    .withMessage("Appointment ID is required")
    .isInt({ min: 1 })
    .toInt(),
  body("notes").optional().trim().escape(),
  body("prescriptions").optional().trim().escape(),
  body("recommendations").optional().trim().escape(),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
      });
    }

    const { appointment_id, notes, prescriptions, recommendations } = req.body;

    try {
      // Check if appointment exists
      const appointment = await pool.query(
        `SELECT * FROM appointment.bookings WHERE id = $1`,
        [appointment_id]
      );

      if (appointment.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message: "Appointment not found",
        });
      }

      // Check if a consultation record already exists for this appointment
      const existing = await pool.query(
        `SELECT * FROM consultation.records WHERE appointment_id = $1`,
        [appointment_id]
      );

      if (existing.rowCount > 0) {
        // Update existing consultation record
        const updated = await pool.query(
          `UPDATE consultation.records
           SET notes = $1,
               prescriptions = $2,
               recommendations = $3,
               updated_at = NOW()
           WHERE appointment_id = $4
           RETURNING *`,
          [
            notes || null,
            prescriptions || null,
            recommendations || null,
            appointment_id,
          ]
        );

        return res.status(200).json({
          success: true,
          message: "Consultation record updated successfully",
          consultation: updated.rows[0],
        });
      }

      // Save new consultation record
      const record = await pool.query(
        `INSERT INTO consultation.records
          (appointment_id, notes, prescriptions, recommendations)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          appointment_id,
          notes || null,
          prescriptions || null,
          recommendations || null,
        ]
      );

      return res.status(201).json({
        success: true,
        message: "Consultation record saved successfully",
        consultation: record.rows[0],
      });
    } catch (error) {
      console.error("❌ Error saving consultation record:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  },
];
