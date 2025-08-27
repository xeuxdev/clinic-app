import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
  // Role selection route
  route("/auth/role-selection", "routes/auth/role-selection.tsx"),

  // Auth layout with login/signup
  layout("routes/auth/layout.tsx", [
    route("auth/login", "routes/auth/login.tsx"),
    route("auth/signup", "routes/auth/signup.tsx"),
    route("auth/logout", "routes/auth/logout.tsx"),
  ]),

  // Attendant/Receptionist routes
  layout("routes/app/layout.tsx", [
    route("/", "routes/app/attendant-dashboard.tsx"),
    route("/patients", "routes/app/patients/patients.tsx"),
    route("/patients/register", "routes/app/patients/register.tsx"),
    route("/appointments", "routes/app/appointments/appointments.tsx"),
    route("/appointments/book", "routes/app/appointments/book.tsx"),
    route("/payments", "routes/app/payments/payments.tsx"),

    // Doctor routes
    route("/doctor", "routes/app/doctor/dashboard.tsx"),
    route("/doctor/consultation/:id", "routes/app/doctor/consultation.tsx"),
  ]),
] satisfies RouteConfig;
