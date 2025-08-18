import { type RouteConfig, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/auth/layout.tsx", [
    route("auth/login", "routes/auth/login.tsx"),
    route("auth/signup", "routes/auth/signup.tsx"),
    route("auth/health-profile", "routes/auth/health-profile.tsx"),
  ]),
  layout("routes/app/layout.tsx", [
    route("/", "routes/app/home.tsx"),
    route("/services", "routes/app/services.tsx"),
    route("/appointment", "routes/app/appointment/appointment.tsx"),
  ]),
] satisfies RouteConfig;
