import { DashboardSidebar, DashboardHeader } from "@/components/layout";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <DashboardSidebar />
      <div className="ml-60">
        <DashboardHeader />
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
