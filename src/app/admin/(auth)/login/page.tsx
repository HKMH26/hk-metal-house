"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Login successful!");
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      console.error("Login error:", err);
      toast.error("Failed to connect to authentication server. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-500">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-8 text-center text-white relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Lock size={80} />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
        <p className="text-blue-100/80 mt-1 text-sm font-medium uppercase tracking-widest">Sign in to your account</p>
      </div>

      <form onSubmit={handleLogin} className="p-10 space-y-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-900 transition-colors" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all text-gray-800 bg-white shadow-sm"
                placeholder="admin@hkmetalhouse.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Password</label>
              <Link 
                href="/admin/forgot-password" 
                className="text-[10px] font-bold text-blue-900 hover:underline transition-all uppercase tracking-wider"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-900 transition-colors" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent outline-none transition-all text-gray-800 bg-white shadow-sm"
                placeholder="••••••••"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-800 transition-all flex items-center justify-center gap-3 disabled:opacity-70 shadow-xl shadow-blue-900/20 active:scale-[0.98]"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : "Login to Dashboard"}
        </button>
      </form>
    </div>
  );
}
