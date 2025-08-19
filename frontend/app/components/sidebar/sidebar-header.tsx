import { Bell, Download, Settings } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { SidebarTrigger } from "~/components/ui/sidebar";

export default function SidebarHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 sm:gap-4 border-b px-3 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <SidebarTrigger className="-ml-1" />
      </div>
      <div className="flex items-center gap-1 sm:gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>

        <Select defaultValue="this-week">
          <SelectTrigger className="w-20 sm:w-32 text-xs sm:text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-week">
              <span className="hidden sm:inline">This Week</span>
              <span className="sm:hidden">Week</span>
            </SelectItem>
            <SelectItem value="this-month">
              <span className="hidden sm:inline">This Month</span>
              <span className="sm:hidden">Month</span>
            </SelectItem>
            <SelectItem value="this-year">
              <span className="hidden sm:inline">This Year</span>
              <span className="sm:hidden">Year</span>
            </SelectItem>
          </SelectContent>
        </Select>

        <Button className="hidden sm:flex text-sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>

        {/* Mobile Export Button - Icon Only */}
        <Button variant="ghost" size="icon" className="sm:hidden h-8 w-8">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
