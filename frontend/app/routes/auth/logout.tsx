import { redirect } from "react-router";
import type { Route } from "./+types/logout";

export async function loader({ request }: Route.LoaderArgs) {
  return redirect("/", {
    headers: {
      "Set-Cookie": [
        "HealthCare_session" +
          "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly",
      ].join(", "),
    },
  });
}

export default function LogoutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Logging out...</p>
      </div>
    </div>
  );
}
