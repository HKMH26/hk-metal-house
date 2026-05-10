import { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8FBFF] via-[#F6F9FC] to-[#EEF4FF] flex flex-col items-center justify-center p-4">
      <Toaster position="top-right" />
      <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="relative h-20 w-20 mx-auto mb-4 bg-white p-2 rounded-2xl shadow-xl shadow-blue-900/5 border border-blue-50">
          <Image 
            src="/images/hk-metal-house-logo.png" 
            alt="HK Metal House" 
            width={80} 
            height={80} 
            className="object-contain w-full h-full" 
          />
        </div>
        <h1 className="text-2xl font-black text-blue-900 tracking-tight">HK METAL HOUSE</h1>
        <p className="text-sm font-bold text-blue-600/60 uppercase tracking-[0.2em] mt-1">Admin Panel</p>
      </div>
      {children}
    </div>
  );
}
