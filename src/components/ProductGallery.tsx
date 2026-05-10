"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  name: string;
  images: { url: string }[];
  primaryImage: string | null;
}

export default function ProductGallery({ name, images, primaryImage }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(primaryImage || images[0]?.url || "");

  const galleryImages = images.length > 0 ? images : [{ url: primaryImage || "" }];

  return (
    <div className="space-y-6">
      {/* Main Image Container */}
      <div className="relative aspect-square w-full bg-white border border-gray-200 rounded-2xl shadow-lg p-6 overflow-hidden flex items-center justify-center group">
        {selectedImage && (
          <Image
            src={selectedImage}
            alt={name}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105 p-6"
            sizes="(max-width: 1024px) 100vw, 40vw"
            priority
          />
        )}
      </div>

      {/* Thumbnail Strip */}
      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
          {galleryImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img.url)}
              className={cn(
                "relative aspect-square rounded-xl overflow-hidden border-2 transition-all bg-white p-1",
                selectedImage === img.url 
                  ? "border-primary shadow-md" 
                  : "border-gray-100 hover:border-gray-300"
              )}
              aria-label={`View product image ${idx + 1}`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={img.url}
                  alt={`${name} thumbnail ${idx + 1}`}
                  fill
                  className="object-contain"
                  sizes="100px"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
