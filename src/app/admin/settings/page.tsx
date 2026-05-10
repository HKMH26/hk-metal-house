"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Save, 
  Loader2, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  Map
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const [settings, setSettings] = useState({
    companyName: "HK Metal House",
    address: "",
    phone: "",
    email: "",
    googleMapsUrl: "",
    workingHours: "",
    socialLinks: {
      facebook: "",
      instagram: "",
      twitter: "",
      linkedin: ""
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .eq("key", "business_info")
      .single();

    if (error && error.code !== "PGRST116") { // PGRST116 is "no rows found"
      toast.error(error.message);
    } else if (data) {
      setSettings(data.value);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from("settings")
      .upsert({ 
        key: "business_info", 
        value: settings,
        updated_at: new Date().toISOString()
      }, { onConflict: 'key' });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Settings saved successfully!");
    }
    setSaving(false);
  };

  const handleChange = (field: string, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-gray-500 font-medium">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 mt-2">Manage your business information and site settings.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-70"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save Changes
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Basic Info */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <Building2 className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Company Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Company Name</label>
              <input 
                type="text" 
                value={settings.companyName}
                onChange={(e) => handleChange("companyName", e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Contact Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email" 
                  value={settings.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={settings.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Working Hours</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  value={settings.workingHours}
                  onChange={(e) => handleChange("workingHours", e.target.value)}
                  placeholder="e.g. Mon - Sat: 9:00 AM - 7:00 PM"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Office Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
              <textarea 
                rows={3}
                value={settings.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>

        {/* Location & Maps */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <Map className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Map & Location</h2>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Google Maps Embed URL</label>
            <input 
              type="text" 
              value={settings.googleMapsUrl}
              onChange={(e) => handleChange("googleMapsUrl", e.target.value)}
              placeholder="https://www.google.com/maps/embed?pb=..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-gray-500">Paste the 'src' attribute from the Google Maps iframe embed code.</p>
          </div>
        </section>

        {/* Social Media */}
        <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <div className="flex items-center gap-3 border-b pb-4">
            <Globe className="text-primary" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Social Media Links</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Facebook size={16} className="text-blue-600" /> Facebook
              </label>
              <input 
                type="text" 
                value={settings.socialLinks.facebook}
                onChange={(e) => handleSocialChange("facebook", e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Instagram size={16} className="text-pink-600" /> Instagram
              </label>
              <input 
                type="text" 
                value={settings.socialLinks.instagram}
                onChange={(e) => handleSocialChange("instagram", e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Twitter size={16} className="text-blue-400" /> Twitter
              </label>
              <input 
                type="text" 
                value={settings.socialLinks.twitter}
                onChange={(e) => handleSocialChange("twitter", e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Linkedin size={16} className="text-blue-700" /> LinkedIn
              </label>
              <input 
                type="text" 
                value={settings.socialLinks.linkedin}
                onChange={(e) => handleSocialChange("linkedin", e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </section>
      </form>
    </div>
  );
}
