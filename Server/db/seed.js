import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { pool } from "./init_db.js";

dotenv.config();

/**
 * Seed script
 * - 5 doctors
 * - 10 patients
 * - 20 appointments
 *
 * This script is idempotent in the sense that it clears relevant tables
 * before inserting fresh data. Use with caution on production databases.
 */

const SALT_ROUNDS = 10;

const clearTables = async (client) => {
  // delete in order to respect FK constraints
  await client.query("BEGIN");
  try {
    await client.query("DELETE FROM consultation.records");
    await client.query("DELETE FROM appointment.bookings");
    await client.query("DELETE FROM doctor.details");
    await client.query('DELETE FROM "user".profile');
    await client.query("DELETE FROM auth.accounts");
    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }
};

const createAccount = async (client, email, password, role = "patient") => {
  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const res = await client.query(
    `INSERT INTO auth.accounts (email, password, role, isVerified, created_at, updated_at)
     VALUES ($1,$2,$3, true, NOW(), NOW()) RETURNING id`,
    [email, hashed, role]
  );
  return res.rows[0].id;
};

const createProfile = async (client, accountId, fullName, phone, dob) => {
  const res = await client.query(
    `INSERT INTO "user".profile (account_id, full_name, phone_number, date_of_birth, created_at, updated_at)
     VALUES ($1,$2,$3,$4,NOW(),NOW()) RETURNING id`,
    [accountId, fullName, phone, dob]
  );
  return res.rows[0].id;
};

const createDoctorDetails = async (
  client,
  accountId,
  specialization,
  licenseNumber,
  years
) => {
  const res = await client.query(
    `INSERT INTO doctor.details (account_id, specialization, license_number, years_of_experience, created_at)
     VALUES ($1,$2,$3,$4,NOW()) RETURNING id`,
    [accountId, specialization, licenseNumber, years]
  );
  return res.rows[0].id;
};

const createAppointment = async (
  client,
  profileId,
  doctorId,
  appointmentDate,
  note,
  status = "booked"
) => {
  const paymentStatus = status === "completed" ? "paid" : "pending";
  const res = await client.query(
    `INSERT INTO appointment.bookings (profile_id, doctor_id, appointment_date, note, paymentStatus, status, created_at, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,NOW(),NOW()) RETURNING id`,
    [profileId, doctorId, appointmentDate, note, paymentStatus, status]
  );
  return res.rows[0].id;
};

const randomDateBetween = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const seed = async () => {
  const client = await pool.connect();
  try {
    console.log("Clearing existing data...");
    await clearTables(client);

    // Predefined doctors
    const doctors = [
      {
        name: "Dr. Amina Yusuf",
        specialization: "Cardiology",
        license: "DL-1001",
        years: 12,
      },
      {
        name: "Dr. Emeka Okafor",
        specialization: "Orthopedics",
        license: "DL-1002",
        years: 8,
      },
      {
        name: "Dr. Grace Nwosu",
        specialization: "Pediatrics",
        license: "DL-1003",
        years: 6,
      },
      {
        name: "Dr. Ibrahim Bello",
        specialization: "Neurology",
        license: "DL-1004",
        years: 10,
      },
      {
        name: "Dr. Zara Abdullahi",
        specialization: "Dermatology",
        license: "DL-1005",
        years: 4,
      },
    ];

    const doctorAccountIds = [];
    const doctorProfileIds = [];
    const doctorDetailIds = [];

    // Create doctor accounts & profiles & doctor.details
    for (let i = 0; i < doctors.length; i++) {
      const d = doctors[i];
      const email = `doctor${i + 1}@hospital.test`;
      const accId = await createAccount(client, email, "Test123!", "doctor");
      doctorAccountIds.push(accId);
      const profileId = await createProfile(
        client,
        accId,
        d.name,
        `080${1000000 + i}`,
        `1975-01-0${i + 1}`
      );
      doctorProfileIds.push(profileId);
      const docId = await createDoctorDetails(
        client,
        accId,
        d.specialization,
        d.license,
        d.years
      );
      doctorDetailIds.push(docId);
    }

    // Create attendants (receptionists) - 3 accounts
    const attendants = [
      {
        name: "Aisha Musa",
        phone: "0803000001",
        email: "attendant1@hospital.test",
      },
      {
        name: "John Peter",
        phone: "0803000002",
        email: "attendant2@hospital.test",
      },
      {
        name: "Mary Johnson",
        phone: "0803000003",
        email: "attendant3@hospital.test",
      },
    ];

    const attendantAccountIds = [];
    const attendantProfileIds = [];

    for (let i = 0; i < attendants.length; i++) {
      const a = attendants[i];
      const accId = await createAccount(
        client,
        a.email,
        "Test123!",
        "attendant"
      );
      attendantAccountIds.push(accId);
      const profileId = await createProfile(
        client,
        accId,
        a.name,
        a.phone,
        null
      );
      attendantProfileIds.push(profileId);
    }

    // Create patients
    const patients = [];
    for (let i = 0; i < 10; i++) {
      const email = `patient${i + 1}@example.test`;
      const accId = await createAccount(client, email, "Test123!", "patient");
      const fullName = `Patient ${i + 1}`;
      const phone = `080${2000000 + i}`;
      const dob = `199${i % 10}-0${(i % 9) + 1}-15`;
      const profileId = await createProfile(
        client,
        accId,
        fullName,
        phone,
        dob
      );
      patients.push({ accountId: accId, profileId, fullName });
    }

    // Create 20 appointments distributed among patients and doctors
    console.log("Creating appointments...");
    const now = new Date();
    const future = new Date();
    future.setMonth(future.getMonth() + 6);

    for (let i = 0; i < 20; i++) {
      const patient = patients[i % patients.length];
      const doctorIndex = i % doctorDetailIds.length;
      const doctorId = doctorDetailIds[doctorIndex];

      // Mix past and future dates
      const start = new Date(now.getTime());
      start.setMonth(start.getMonth() - 3);
      const appointmentDate = randomDateBetween(start, future);
      const note = `Checkup #${i + 1} for ${patient.fullName}`;
      const status = i % 7 === 0 ? "completed" : "booked";

      await createAppointment(
        client,
        patient.profileId,
        doctorId,
        appointmentDate,
        note,
        status
      );
    }

    console.log("Seeding complete.");
  } catch (err) {
    console.error("Error seeding data:", err.message || err);
  } finally {
    client.release();
    process.exit(0);
  }
};

seed();
