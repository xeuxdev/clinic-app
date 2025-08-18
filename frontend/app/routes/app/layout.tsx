import { Outlet } from "react-router";
import { AppSidebar } from "~/components/sidebar/app-sidebar";
import SidebarHeader from "~/components/sidebar/sidebar-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

export default function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <SidebarHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
