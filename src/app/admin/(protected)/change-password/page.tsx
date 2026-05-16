"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, Save, KeyRound, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import PasswordInput from "@/components/admin/PasswordInput";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (password.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    if (!/\d/.test(password)) {
      toast.error("Password must contain at least one number.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    } else {
      toast.success("Password changed successfully.");
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 px-2 sm:px-0 py-4 sm:py-0">
      <div className="flex items-center gap-4 px-2 sm:px-0">
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-[#0B3D91] shrink-0">
          <KeyRound size={24} className="sm:w-7 sm:h-7" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">Change Password</h1>
          <p className="text-sm sm:text-base text-gray-500 font-medium mt-0.5">Update your administrative account security.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-50 overflow-hidden">
        <div className="bg-gradient-to-r from-[#0B3D91] to-[#082D5F] p-6 sm:p-8 text-white">
          <h2 className="text-lg sm:text-xl font-bold">Security Settings</h2>
          <p className="text-blue-100/80 text-xs sm:text-sm mt-1 font-medium">Manage your login credentials below.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-10 space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            <PasswordInput
              label="New Password"
              value={password}
              onChange={setPassword}
              required
              placeholder="Enter at least 8 characters"
            />
            <PasswordInput
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
              placeholder="Repeat your new password"
            />
          </div>

          <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 flex items-start gap-4">
            <div className="bg-amber-100 p-2 rounded-xl text-amber-600 shrink-0">
              <ShieldAlert size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-amber-900 uppercase tracking-wide">Security Requirements</p>
              <ul className="text-xs text-amber-800/80 space-y-1 list-disc ml-4 font-medium">
                <li>Minimum 8 characters in length</li>
                <li>At least one numeric digit (0-9)</li>
                <li>Must match exactly with the confirmation field</li>
              </ul>
            </div>
          </div>

          <div className="pt-2 sm:pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-[#0B3D91] text-white px-8 sm:px-10 py-4 auto rounded-2xl font-bold text-base sm:text-lg hover:bg-[#0A3A7A] transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-[0_8px_20px_rgba(11,61,145,0.2)] active:scale-95"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                  <Save size={20} /> Save New Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
