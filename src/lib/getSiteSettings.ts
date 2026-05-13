import { createClient } from "./supabase/server";
import { companyInfo } from "@/data/company";

export interface SiteSettings {
  companyName: string;
  address: string;
  phone: string;
  email: string;
  googleMapsUrl: string;
  googleMapsDirectionUrl: string;
  workingHours: string;
  inquiryEmail: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
}

export const defaultSettings: SiteSettings = {
  companyName: companyInfo.name,
  address: companyInfo.contact.address,
  phone: companyInfo.contact.phone,
  email: companyInfo.contact.email,
  googleMapsUrl: "",
  googleMapsDirectionUrl: "",
  workingHours: companyInfo.contact.workingHours,
  inquiryEmail: companyInfo.contact.email,
  socialLinks: {
    facebook: companyInfo.socials.facebook,
    instagram: "",
    twitter: companyInfo.socials.twitter,
    linkedin: companyInfo.socials.linkedin,
  },
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("key", "business_info")
    .single();

  if (error || !data) {
    console.error("Error fetching settings, using defaults:", error);
    return defaultSettings;
  }

  const value = data.value;

  // Ensure all fields exist and have defaults if missing
  const settings: SiteSettings = {
    companyName: value.companyName || defaultSettings.companyName,
    address: value.address || defaultSettings.address,
    phone: value.phone || defaultSettings.phone,
    email: value.email || defaultSettings.email,
    googleMapsUrl: formatGoogleMapsEmbedUrl(value.googleMapsUrl, value.address || defaultSettings.address),
    googleMapsDirectionUrl: value.googleMapsDirectionUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(value.address || defaultSettings.address)}`,
    workingHours: value.workingHours || defaultSettings.workingHours,
    inquiryEmail: value.inquiryEmail || value.email || defaultSettings.inquiryEmail,
    socialLinks: {
      facebook: value.socialLinks?.facebook || "",
      instagram: value.socialLinks?.instagram || "",
      twitter: value.socialLinks?.twitter || "",
      linkedin: value.socialLinks?.linkedin || "",
    },
  };

  return settings;
}

function formatGoogleMapsEmbedUrl(url: string | undefined, address: string): string {
  if (!url) {
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  }

  // If it's already an embed URL or has output=embed, return it
  if (url.includes("google.com/maps/embed") || url.includes("output=embed")) {
    return url;
  }

  // If it's a normal Google Maps URL, try to convert it
  if (url.includes("google.com/maps")) {
    if (url.includes("?q=")) {
      return url.replace("/maps?", "/maps/embed?").includes("output=embed") ? url : `${url}&output=embed`;
    }
    return `${url}${url.includes("?") ? "&" : "?"}output=embed`;
  }

  // If all else fails, generate from address
  return `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
}
