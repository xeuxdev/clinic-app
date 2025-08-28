import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/layout";
import { siteConfig } from "~/lib/site";

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = Object.fromEntries(
    cookieHeader?.split("; ").map((c) => c.split("=")) || []
  );

  const url = new URL(request.url);
  const path = url.pathname;

  if (path === "/auth/logout") {
    return null;
  }

  if (cookie[siteConfig.cookieNames.session]) {
    return redirect("/");
  }
}

export default function AuthLayout() {
  return (
    <div className="h-screen flex">
      {/* Left side - Auth forms */}
      <div className="flex-1 flex items-center justify-center bg-background">
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
