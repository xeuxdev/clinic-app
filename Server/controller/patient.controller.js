import { body } from "express-validator";
import { pool } from "../db/init_db.js";

// Get all patients (accounts with role = 'patient')
export const getPatients = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id as account_id, a.email, a.role, p.*
       FROM auth.accounts a
       JOIN "user".profile p ON p.account_id = a.id
       WHERE a.role = $1
       ORDER BY p.full_name ASC`,
      ["patient"]
    );

    return res.status(200).json({ success: true, patients: result.rows });
  } catch (error) {
    console.error("Error fetching patients:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Search patients by name, email or phone (query param: q)
export const searchPatients = [
  // validation
  body("q").optional().trim().escape(),

  async (req, res) => {
    // allow either query string or body (prefers query)
    const q = (req.query.q || req.body.q || "").trim();

    if (!q) {
      return res
        .status(400)
        .json({ success: false, message: "Search query is required" });
    }

    try {
      const pattern = `%${q}%`;
      const result = await pool.query(
        `SELECT a.id as account_id, a.email, a.role, p.*
         FROM auth.accounts a
         JOIN "user".profile p ON p.account_id = a.id
         WHERE a.role = 'patient' AND (
           p.full_name ILIKE $1 OR a.email ILIKE $1 OR p.phone_number ILIKE $1
         )
         ORDER BY p.full_name ASC`,
        [pattern]
      );

      return res.status(200).json({ success: true, results: result.rows });
    } catch (error) {
      console.error("Error searching patients:", error.message);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  },
];

export const getConsultationById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT * FROM consultation.records WHERE appointment_id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Consultation record not found",
      });
    }

    const consultation = result.rows[0];

    // Fetch appointment info
    const appointmentResult = await pool.query(
      `SELECT * FROM appointment.bookings WHERE id = $1`,
      [id]
    );

    if (appointmentResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const appointment = appointmentResult.rows[0];
    const doctorId = appointment.doctor_id;
    const patientId = appointment.profile_id;

    // Fetch doctor profile
    const doctorProfileResult = await pool.query(
      `SELECT * FROM "user".profile WHERE account_id = $1`,
      [doctorId]
    );

    const doctorProfile = doctorProfileResult.rows[0] || null;

    // Fetch doctor details
    const doctorDetailsResult = await pool.query(
      `SELECT * FROM doctor.details WHERE account_id = $1`,
      [doctorId]
    );

    const doctorDetails = doctorDetailsResult.rows;

    // Fetch patient profile
    const patientProfileResult = await pool.query(
      `SELECT * FROM "user".profile WHERE account_id = $1`,
      [patientId]
    );

    const patientProfile = patientProfileResult.rows[0] || null;

    return res.status(200).json({
      success: true,
      consultation,
      appointmentInfo: appointment,
      doctorInfo: {
        profile: doctorProfile,
        details: doctorDetails,
      },
      patientInfo: patientProfile,
    });
  } catch (error) {
    console.error("❌ Error fetching consultation record:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get doctors (accounts with role = 'doctor') with profiles and doctor details
export const getDoctors = async (req, res) => {
  try {
    const doctorAccounts = await pool.query(
      `SELECT * FROM auth.accounts WHERE role = $1 ORDER BY email ASC`,
      ["doctor"]
    );

    if (doctorAccounts.rowCount === 0) {
      return res.status(200).json({ success: true, doctors: [] });
    }

    const accountIds = doctorAccounts.rows.map((r) => r.id);

    const profilesResult = await pool.query(
      `SELECT * FROM "user".profile WHERE account_id = ANY($1::int[])`,
      [accountIds]
    );

    const detailsResult = await pool.query(
      `SELECT * FROM doctor.details WHERE account_id = ANY($1::int[])`,
      [accountIds]
    );

    // Build lookup maps for quick association
    const profilesMap = new Map();
    profilesResult.rows.forEach((p) => profilesMap.set(p.account_id, p));

    const detailsMap = new Map();
    detailsResult.rows.forEach((d) => {
      const arr = detailsMap.get(d.account_id) || [];
      arr.push(d);
      detailsMap.set(d.account_id, arr);
    });

    // For each doctor account return the profile info plus a details field
    const doctors = doctorAccounts.rows.map((acct) => {
      const profile = profilesMap.get(acct.id) || null;
      const details = detailsMap.get(acct.id) || [];
      if (profile) {
        // return profile fields with nested details
        return { ...profile, details };
      }
      // if no profile, return minimal object with account id and details
      return { account_id: acct.id, details };
    });

    return res.status(200).json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.error("Error fetching doctors:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid doctor id" });
    }

    const accountResult = await pool.query(
      `SELECT * FROM auth.accounts WHERE id = $1 AND role = $2`,
      [id, "doctor"]
    );

    if (accountResult.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Doctor not found" });
    }

    const profileResult = await pool.query(
      `SELECT * FROM "user".profile WHERE account_id = $1`,
      [id]
    );

    const detailsResult = await pool.query(
      `SELECT * FROM doctor.details WHERE account_id = $1`,
      [id]
    );

    return res.status(200).json({
      success: true,
      doctor: accountResult.rows[0],
      profile: profileResult.rows[0] || null,
      details: detailsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching doctor by id:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
