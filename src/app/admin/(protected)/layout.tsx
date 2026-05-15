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
    <div className="flex min-h-screen bg-[#F6F9FC]">
      <SessionManager />
      <Sidebar />
      <main className="flex-1 lg:ml-80 p-4 sm:p-8 bg-gradient-to-br from-[#F8FBFF] via-[#F6F9FC] to-[#EEF4FF] min-h-screen pb-24 lg:pb-8">
        <Toaster position="top-right" />
        {children}
      </main>
      <AdminBottomNav />
    </div>
  );
}
