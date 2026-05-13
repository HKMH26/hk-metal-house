"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function SessionManager() {
  const supabase = createClient();

  useEffect(() => {
    const handleUnload = () => {
      // We use a synchronous approach or beacon if possible for unload events, 
      // but since supabase.auth.signOut() is async, we'll follow the requested implementation.
      // Note: signOut() clears the cookies which is the main goal here.
      supabase.auth.signOut();
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [supabase]);

  return null;
}
