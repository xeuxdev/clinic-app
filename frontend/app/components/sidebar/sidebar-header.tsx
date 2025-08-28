import { SidebarTrigger } from "~/components/ui/sidebar";

export default function SidebarHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 sm:gap-4 border-b px-3 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <SidebarTrigger className="-ml-1" />
      </div>
      <div className="flex items-center gap-1 sm:gap-3"></div>
    </header>
  );
}
