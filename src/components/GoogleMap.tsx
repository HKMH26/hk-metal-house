"use client";

import { ExternalLink } from "lucide-react";
import { companyInfo } from "@/data/company";

export default function GoogleMap() {
  const encodedAddress = encodeURIComponent(companyInfo.contact.address);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyB_REPLACE_WITH_YOUR_KEY&q=${encodedAddress}`;
  
  // Note: For a public website without a specific API key, we use the standard iframe embed URL
  const publicEmbedUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

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
