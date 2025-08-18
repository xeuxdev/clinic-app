import {
  Activity,
  Bell,
  Calendar,
  CreditCard,
  HelpCircle,
  Home,
  Mail,
  Settings,
  Stethoscope,
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

// Medical dashboard navigation data
const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Services",
    url: "/services",
    icon: Stethoscope,
  },
  {
    title: "Appointment",
    url: "/appointment",
    icon: Calendar,
  },
  {
    title: "Payment",
    url: "/payment",
    icon: CreditCard,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

const bottomNavigationItems = [
  {
    title: "Inbox",
    url: "/inbox",
    icon: Mail,
  },
  {
    title: "Notification",
    url: "/notification",
    icon: Bell,
  },
  {
    title: "Help",
    url: "/help",
    icon: HelpCircle,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Activity className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">MediCare</h2>
            <p className="text-sm text-gray-600">Healthcare Portal</p>
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
