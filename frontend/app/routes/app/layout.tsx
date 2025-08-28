import { Outlet, redirect } from "react-router";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
import SidebarHeader from "~/components/sidebar/sidebar-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import type { Route } from "./+types/layout";
import { siteConfig } from "~/lib/site";

export async function loader({ request }: Route.LoaderArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookie = Object.fromEntries(
    cookieHeader?.split("; ").map((c) => c.split("=")) || []
  );

  if (!cookie[siteConfig.cookieNames.session]) {
    return redirect("/auth/login");
  }
}

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <SidebarHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
