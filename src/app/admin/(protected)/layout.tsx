import Sidebar from "@/components/admin/Sidebar";
import SessionManager from "@/components/admin/SessionManager";
import { Toaster } from "react-hot-toast";
import AdminBottomNav from "@/components/admin/AdminBottomNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] bg-[#F6F9FC] overflow-x-hidden">
      <SessionManager />
      <Sidebar />
      <main className="flex-1 lg:ml-80 px-4 sm:px-8 pt-[96px] lg:pt-8 bg-gradient-to-br from-[#F8FBFF] via-[#F6F9FC] to-[#EEF4FF] min-h-[100dvh] pb-[calc(180px+env(safe-area-inset-bottom))] lg:pb-8 flex flex-col">
        <Toaster position="top-right" />
        {children}
      </main>
      <AdminBottomNav />
    </div>
  );
}
