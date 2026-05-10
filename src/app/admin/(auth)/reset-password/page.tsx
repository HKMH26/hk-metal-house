"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Save, ShieldCheck } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import PasswordInput from "@/components/admin/PasswordInput";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Your password has been updated successfully.");
        setTimeout(() => {
          router.push("/admin/login");
        }, 2000);
      }
    } catch (err: any) {
      console.error("Reset password error:", err);
      toast.error("Failed to connect to authentication server. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-500">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-center text-white relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <ShieldCheck size={80} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Set New Password</h2>
        <p className="text-blue-100/80 mt-1 text-sm font-medium uppercase tracking-widest">Update your account security</p>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-8">
        <div className="space-y-6">
          <PasswordInput
            label="New Password"
            value={password}
            onChange={setPassword}
            required
          />
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            required
          />
        </div>

        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-start gap-3">
          <ShieldCheck className="text-blue-600 shrink-0 mt-0.5" size={18} />
          <p className="text-xs text-blue-800 leading-relaxed font-medium">
            Choose a strong password with at least 8 characters. After updating, you will be automatically redirected to the login page.
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-xl shadow-blue-900/20 active:scale-[0.98]"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : (
            <>
              <Save size={20} /> Update Password
            </>
          )}
        </button>
      </form>
    </div>
  );
}
