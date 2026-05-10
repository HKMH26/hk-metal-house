import { createClient } from "./server";

export async function getBusinessInfo() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("settings")
    .select("value")
    .eq("key", "business_info")
    .single();

  if (error || !data) {
    return null;
  }

  return data.value;
}
