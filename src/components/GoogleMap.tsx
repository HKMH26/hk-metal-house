"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { companyInfo } from "@/data/company";

export default function GoogleMap() {
  const [settings, setSettings] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "business_info")
        .single();
      
      if (data) {
        setSettings(data.value);
      }
    };

    fetchSettings();
  }, []);

  const address = settings?.address || companyInfo.contact.address;
  const customEmbedUrl = settings?.googleMapsUrl;
  const customDirectionUrl = settings?.googleMapsDirectionUrl;
  
  const encodedAddress = encodeURIComponent(address);
  
  // Use custom URL if provided, otherwise fallback to a generic embed URL based on the address
  let publicEmbedUrl = customEmbedUrl;
  
  if (!publicEmbedUrl) {
    publicEmbedUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
  } else if (publicEmbedUrl.includes("google.com/maps") && !publicEmbedUrl.includes("output=embed") && !publicEmbedUrl.includes("embed")) {
    // If the user provided a normal Google Maps link, try to convert it to an embed link
    if (publicEmbedUrl.includes("?q=")) {
      publicEmbedUrl = publicEmbedUrl.replace("/maps?", "/maps/embed?").includes("output=embed") ? publicEmbedUrl : `${publicEmbedUrl}&output=embed`;
    } else {
      publicEmbedUrl = `${publicEmbedUrl}${publicEmbedUrl.includes("?") ? "&" : "?"}output=embed`;
    }
  }

  const directionsUrl = customDirectionUrl || `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

  return (
    <div className="w-full space-y-4">
      <div className="relative w-full rounded-xl shadow-lg overflow-hidden border border-gray-100 bg-gray-50 group">
        <iframe
          src={publicEmbedUrl}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-[250px] md:h-[300px] transition-opacity duration-300 group-hover:opacity-90"
          title="HK Metal House Location"
        ></iframe>
      </div>
      
      <a 
        href={directionsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors group"
      >
        <div className="bg-primary group-hover:bg-secondary p-2 rounded-lg transition-colors">
          <ExternalLink size={16} className="text-white" />
        </div>
        <span>Get Directions on Google Maps</span>
      </a>
    </div>
  );
}
