import React from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { SiteSettings } from "@/lib/getSiteSettings";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SocialLinksProps {
  settings: SiteSettings;
  className?: string;
  iconClassName?: string;
}

export default function SocialLinks({ settings, className, iconClassName }: SocialLinksProps) {
  const { socialLinks } = settings;

  if (!socialLinks) return null;

  const platforms = [
    {
      name: "Facebook",
      url: socialLinks.facebook,
      icon: Facebook,
      color: "hover:text-blue-600",
    },
    {
      name: "Instagram",
      url: socialLinks.instagram,
      icon: Instagram,
      color: "hover:text-pink-600",
    },
    {
      name: "Twitter",
      url: socialLinks.twitter,
      icon: Twitter,
      color: "hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      url: socialLinks.linkedin,
      icon: Linkedin,
      color: "hover:text-blue-700",
    },
  ];

  // Filter out platforms without a URL
  const activePlatforms = platforms.filter((p) => p.url && p.url.trim() !== "");

  if (activePlatforms.length === 0) return null;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      {activePlatforms.map((platform) => {
        const Icon = platform.icon;
        return (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform.name}
            className={cn(
              "transition-all duration-300 transform hover:scale-110",
              platform.color,
              iconClassName
            )}
          >
            <Icon size={20} />
          </a>
        );
      })}
    </div>
  );
}
