import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect("/admin/dashboard");
  } else {
    redirect("/admin/login");
  }

  // This component doesn't render anything as it always redirects
  return null;
}
