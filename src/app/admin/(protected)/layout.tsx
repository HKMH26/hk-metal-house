import Sidebar from "@/components/admin/Sidebar";
import { Toaster } from "react-hot-toast";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-[#F6F9FC]">
      <Sidebar />
      <main className="flex-1 ml-80 p-8 bg-gradient-to-br from-[#F8FBFF] via-[#F6F9FC] to-[#EEF4FF] min-h-screen">
        <Toaster position="top-right" />
        {children}
      </main>
    </div>
  );
}
