import {
  Activity,
  Calendar,
  CalendarPlus,
  CreditCard,
  HelpCircle,
  Home,
  Settings,
  Stethoscope,
  UserPlus,
  Users,
} from "lucide-react";
import type * as React from "react";
import { Link, useLocation } from "react-router";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import { useUser } from "~/context/user-context";

// Navigation items for attendant/receptionist
const attendantNavigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Patients",
    url: "/patients",
    icon: Users,
  },
  {
    title: "Register Patient",
    url: "/patients/register",
    icon: UserPlus,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
  },
  {
    title: "Book Appointment",
    url: "/appointments/book",
    icon: CalendarPlus,
  },
  {
    title: "Payments",
    url: "/payments",
    icon: CreditCard,
  },
];

// Navigation items for doctor
const doctorNavigationItems = [
  {
    title: "Doctor Dashboard",
    url: "/doctor",
    icon: Stethoscope,
  },
  {
    title: "Patients",
    url: "/patients",
    icon: Users,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: Calendar,
  },
];

const bottomNavigationItems = [
  {
    title: "Logout",
    url: "/auth/logout",
    icon: Settings,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { user } = useUser();

  const userRole = user?.role;

  // Choose navigation items based on user role
  const navigationItems =
    userRole === "doctor" ? doctorNavigationItems : attendantNavigationItems;

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              🏥 Clinic MS
            </h2>
            <p className="text-sm text-gray-600 capitalize">
              {userRole} Portal
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col justify-between">
        <div className="p-2">
          <SidebarMenu>
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.url;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                      ${
                        isActive
                          ? "bg-primary text-white hover:bg-primary/90"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }
                    `}
                  >
                    <Link
                      to={item.url}
                      className="flex items-center gap-3 w-full"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>

        <div className="p-2 border-t border-gray-200">
          <SidebarMenu>
            {bottomNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.url;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="flex items-center"
                  >
                    <Link
                      to={item.url}
                      className="flex items-center gap-3 w-full"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
