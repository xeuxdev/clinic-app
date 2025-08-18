import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Auth forms */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Right side - Doctor image */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <img
          src="/auth-image.webp"
          alt="Healthcare professional with stethoscope"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
