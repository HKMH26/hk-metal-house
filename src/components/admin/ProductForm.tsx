"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Trash2, 
  Loader2,
  Check,
  ChevronDown,
  PlusCircle
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

interface Specification {
  key: string;
  value: string;
}

interface ProductFormProps {
  initialData?: any;
  isEditing?: boolean;
}

export default function ProductForm({ initialData, isEditing = false }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [category, setCategory] = useState(initialData?.category || "Brass Components");
  const [shortDescription, setShortDescription] = useState(initialData?.short_description || "");
  const [fullDescription, setFullDescription] = useState(initialData?.full_description || "");
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [active, setActive] = useState(initialData?.active ?? true);
  
  // Pricing State
  const [price, setPrice] = useState(initialData?.price || "");
  const [priceUnit, setPriceUnit] = useState(initialData?.price_unit || "Piece");
  const [pricePrefix, setPricePrefix] = useState(initialData?.price_prefix || "₹");
  const [showPrice, setShowPrice] = useState(initialData?.show_price ?? true);
  
  // Dynamic Arrays
  const [specifications, setSpecifications] = useState<Specification[]>(
    initialData?.specifications || [{ key: "", value: "" }]
  );
  const [features, setFeatures] = useState<string[]>(initialData?.features || [""]);
  const [applications, setApplications] = useState<string[]>(initialData?.applications || [""]);
  
  // Image Upload
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.product_images?.map((img: any) => img.url) || []);
  const [primaryImage, setPrimaryImage] = useState<string>(initialData?.primary_image || "");

  // SEO State
  const [metaTitle, setMetaTitle] = useState(initialData?.meta_title || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.meta_description || "");

  const handleAddSpec = () => setSpecifications([...specifications, { key: "", value: "" }]);
  const handleRemoveSpec = (index: number) => setSpecifications(specifications.filter((_, i) => i !== index));
  const handleSpecChange = (index: number, field: "key" | "value", val: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = val;
    setSpecifications(newSpecs);
  };

  const handleAddFeature = () => setFeatures([...features, ""]);
  const handleRemoveFeature = (index: number) => setFeatures(features.filter((_, i) => i !== index));
  const handleFeatureChange = (index: number, val: string) => {
    const newFeatures = [...features];
    newFeatures[index] = val;
    setFeatures(newFeatures);
  };

  const handleAddApp = () => setApplications([...applications, ""]);
  const handleRemoveApp = (index: number) => setApplications(applications.filter((_, i) => i !== index));
  const handleAppChange = (index: number, val: string) => {
    const newApps = [...applications];
    newApps[index] = val;
    setApplications(newApps);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        toast.error(`Upload error: ${uploadError.message}`);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      
      uploadedUrls.push(publicUrl);
    }

    setImages([...images, ...uploadedUrls]);
    if (!primaryImage && uploadedUrls.length > 0) setPrimaryImage(uploadedUrls[0]);
    setUploading(false);
    toast.success("Images uploaded successfully!");
  };

  const handleRemoveImage = (url: string) => {
    setImages(images.filter(i => i !== url));
    if (primaryImage === url) setPrimaryImage(images[0] || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    const productData = {
      name,
      slug,
      category,
      short_description: shortDescription,
      full_description: fullDescription,
      specifications,
      features: features.filter(f => f.trim() !== ""),
      applications: applications.filter(a => a.trim() !== ""),
      primary_image: primaryImage,
      featured,
      active,
      price: price ? parseFloat(price) : null,
      price_unit: priceUnit,
      price_prefix: pricePrefix,
      show_price: showPrice,
      meta_title: metaTitle,
      meta_description: metaDescription,
      updated_at: new Date().toISOString(),
    };

    let productId = initialData?.id;

    if (isEditing) {
      const { error } = await supabase
        .from("products")
        .update(productData)
        .eq("id", productId);
      
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from("products")
        .insert(productData)
        .select()
        .single();
      
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      productId = data.id;
    }

    if (isEditing) {
      await supabase.from("product_images").delete().eq("product_id", productId);
    }

    if (images.length > 0) {
      const imageInserts = images.map((url, index) => ({
        product_id: productId,
        url,
        display_order: index,
      }));
      await supabase.from("product_images").insert(imageInserts);
    }

    toast.success(isEditing ? "Product updated successfully!" : "Product created successfully!");
    
    fetch("/api/revalidate?path=/products").catch(console.error);
    fetch(`/api/revalidate?path=/products/${slug}`).catch(console.error);
    fetch("/api/revalidate?path=/").catch(console.error);

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col mb-6">
        <div className="flex items-start gap-4">
          <Link href="/admin/products" className="bg-white p-3 rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all text-[#0F172A] shadow-sm flex-shrink-0 mt-0.5">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[28px] font-bold text-[#0F172A] leading-tight">{isEditing ? "Edit Product" : "Add Product"}</h1>
            <p className="text-[15px] text-[#64748B] mt-1 mb-6">{isEditing ? "Update existing product details." : "Fill in the details to create a new item."}</p>
            
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full sm:w-auto h-[52px] bg-gradient-to-r from-[#0B3D91] to-[#082D5F] text-white px-8 rounded-[16px] font-bold text-[16px] flex items-center justify-center gap-3 disabled:opacity-70 shadow-lg active:scale-95 transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              {isEditing ? "Update Product" : "Save Product"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Accordion: Basic Information */}
          <details open className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E2E8F0] group overflow-hidden">
            <summary className="p-5 md:p-6 cursor-pointer list-none flex justify-between items-center bg-white hover:bg-[#F8FAFC] transition-colors select-none font-bold text-[#0F172A] text-lg lg:text-xl">
              Basic Information
              <ChevronDown size={24} className="group-open:rotate-180 transition-transform text-[#64748B]" />
            </summary>
            <div className="p-5 md:p-6 border-t border-[#E2E8F0] space-y-6 bg-white">
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#0F172A]">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3.5 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#0A4DA3] outline-none text-[16px] text-[#0F172A]"
                  placeholder="e.g. Precision Brass Hex Bolt"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#0F172A]">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3.5 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#0A4DA3] outline-none bg-white text-[16px] text-[#0F172A] min-h-[50px]"
                >
                  <option>Brass Components</option>
                  <option>Stainless Steel</option>
                  <option>Aluminum</option>
                  <option>Copper Components</option>
                  <option>Precision Turned Components</option>
                  <option>CNC Machined Parts</option>
                </select>
              </div>
              <div className="flex flex-col gap-4 p-4 md:p-5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                <label className="flex items-center gap-3 cursor-pointer group min-h-[44px]">
                  <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-[20px] h-[20px] rounded border-[#E2E8F0] text-[#0A4DA3] focus:ring-[#0A4DA3]" />
                  <span className="text-[16px] font-medium text-[#0F172A] group-hover:text-[#0A4DA3] transition-colors">Featured Product</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group min-h-[44px]">
                  <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-[20px] h-[20px] rounded border-[#E2E8F0] text-[#0A4DA3] focus:ring-[#0A4DA3]" />
                  <span className="text-[16px] font-medium text-[#0F172A] group-hover:text-[#0A4DA3] transition-colors">Status Active</span>
                </label>
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#0F172A]">Short Description</label>
                <textarea 
                  rows={3}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-4 py-3.5 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#0A4DA3] outline-none resize-none text-[16px] text-[#0F172A]"
                  placeholder="A brief summary for product cards..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#0F172A]">Full Description</label>
                <textarea 
                  rows={6}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="w-full px-4 py-3.5 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#0A4DA3] outline-none text-[16px] text-[#0F172A] min-h-[140px]"
                  placeholder="Detailed product information..."
                />
              </div>
            </div>
          </details>

          {/* Accordion: Pricing Information */}
          <details className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E2E8F0] group overflow-hidden">
            <summary className="p-5 md:p-6 cursor-pointer list-none flex justify-between items-center bg-white hover:bg-[#F8FAFC] transition-colors select-none font-bold text-[#0F172A] text-lg lg:text-xl">
              Pricing Information
              <ChevronDown size={24} className="group-open:rotate-180 transition-transform text-[#64748B]" />
            </summary>
            <div className="p-5 md:p-6 border-t border-[#E2E8F0] bg-white grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#0F172A]">Product Price</label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3.5 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#0A4DA3] outline-none text-[16px] text-[#0F172A]"
                  placeholder="e.g. 1500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#0F172A]">Currency Symbol</label>
                <input 
                  type="text" 
                  value={pricePrefix}
                  onChange={(e) => setPricePrefix(e.target.value)}
                  className="w-full px-4 py-3.5 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#0A4DA3] outline-none text-[16px] text-[#0F172A]"
                  placeholder="₹"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#0F172A]">Price Unit</label>
                <input 
                  type="text" 
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="w-full px-4 py-3.5 border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#0A4DA3] outline-none text-[16px] text-[#0F172A]"
                  placeholder="e.g. Piece"
                />
              </div>
              <div className="flex items-center min-h-[44px] md:mt-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={showPrice} 
                    onChange={(e) => setShowPrice(e.target.checked)} 
                    className="w-[20px] h-[20px] rounded border-[#E2E8F0] text-[#0A4DA3] focus:ring-[#0A4DA3]" 
                  />
                  <span className="text-[16px] font-medium text-[#0F172A] group-hover:text-[#0A4DA3] transition-colors">Display Price to Customers</span>
                </label>
              </div>
            </div>
          </details>

          {/* Accordion: Specifications */}
          <details className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E2E8F0] group overflow-hidden">
            <summary className="p-5 md:p-6 cursor-pointer list-none flex justify-between items-center bg-white hover:bg-[#F8FAFC] transition-colors select-none font-bold text-[#0F172A] text-lg lg:text-xl">
              Specifications
              <ChevronDown size={24} className="group-open:rotate-180 transition-transform text-[#64748B]" />
            </summary>
            <div className="p-5 md:p-6 border-t border-[#E2E8F0] bg-white space-y-6">
              <div className="space-y-4">
                {specifications.map((spec, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row gap-3">
                    <input 
                      type="text" 
                      placeholder="Key (e.g. Material)" 
                      value={spec.key}
                      onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                      className="flex-1 px-4 py-3.5 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#0A4DA3] text-[16px]"
                    />
                    <div className="flex gap-2">
                       <input 
                        type="text" 
                        placeholder="Value (e.g. Grade 304)" 
                        value={spec.value}
                        onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                        className="flex-1 px-4 py-3.5 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#0A4DA3] text-[16px]"
                      />
                      <button onClick={() => handleRemoveSpec(idx)} className="text-[#64748B] bg-[#F8FAFC] hover:bg-red-50 hover:text-red-600 rounded-xl w-[52px] h-[52px] flex items-center justify-center shrink-0 border border-[#E2E8F0] transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={handleAddSpec} className="text-[#0A4DA3] hover:bg-[#0A4DA3]/5 px-4 py-3 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 w-full border-2 border-dashed border-[#0A4DA3]/20 transition-colors h-[52px]">
                <PlusCircle size={20} /> Add Specification Field
              </button>
            </div>
          </details>

          {/* Accordion: Key Features */}
          <details className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E2E8F0] group overflow-hidden">
            <summary className="p-5 md:p-6 cursor-pointer list-none flex justify-between items-center bg-white hover:bg-[#F8FAFC] transition-colors select-none font-bold text-[#0F172A] text-lg lg:text-xl">
              Key Features
              <ChevronDown size={24} className="group-open:rotate-180 transition-transform text-[#64748B]" />
            </summary>
            <div className="p-5 md:p-6 border-t border-[#E2E8F0] bg-white space-y-6">
              <div className="space-y-4">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2 relative">
                    <input 
                      type="text" 
                      placeholder="e.g. High tolerance durability..." 
                      value={feature}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      className="flex-1 px-4 py-3.5 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#0A4DA3] text-[16px]"
                    />
                    <button onClick={() => handleRemoveFeature(idx)} className="text-[#64748B] hover:text-red-500 bg-[#F8FAFC] hover:bg-red-50 border border-[#E2E8F0] w-[52px] shrink-0 rounded-xl flex items-center justify-center transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleAddFeature} className="text-[#0A4DA3] hover:bg-[#0A4DA3]/5 px-4 py-3 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 w-full border-2 border-dashed border-[#0A4DA3]/20 transition-colors h-[52px]">
                <PlusCircle size={20} /> Add Feature Field
              </button>
            </div>
          </details>

          {/* Accordion: Applications */}
          <details className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E2E8F0] group overflow-hidden">
            <summary className="p-5 md:p-6 cursor-pointer list-none flex justify-between items-center bg-white hover:bg-[#F8FAFC] transition-colors select-none font-bold text-[#0F172A] text-lg lg:text-xl">
              Applications
              <ChevronDown size={24} className="group-open:rotate-180 transition-transform text-[#64748B]" />
            </summary>
            <div className="p-5 md:p-6 border-t border-[#E2E8F0] bg-white space-y-6">
              <div className="space-y-4">
                {applications.map((app, idx) => (
                  <div key={idx} className="flex gap-2 relative">
                    <input 
                      type="text" 
                      placeholder="e.g. Automotive Industry..." 
                      value={app}
                      onChange={(e) => handleAppChange(idx, e.target.value)}
                      className="flex-1 px-4 py-3.5 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#0A4DA3] text-[16px]"
                    />
                    <button onClick={() => handleRemoveApp(idx)} className="text-[#64748B] hover:text-red-500 bg-[#F8FAFC] hover:bg-red-50 border border-[#E2E8F0] w-[52px] shrink-0 rounded-xl flex items-center justify-center transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={handleAddApp} className="text-[#0A4DA3] hover:bg-[#0A4DA3]/5 px-4 py-3 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 w-full border-2 border-dashed border-[#0A4DA3]/20 transition-colors h-[52px]">
                <PlusCircle size={20} /> Add Application Field
              </button>
            </div>
          </details>
        </div>

        {/* Right Column - Media */}
        <div className="space-y-6">
          {/* Accordion: Product Images */}
          <details open className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E2E8F0] group overflow-hidden">
            <summary className="p-5 md:p-6 cursor-pointer list-none flex justify-between items-center bg-white hover:bg-[#F8FAFC] transition-colors select-none font-bold text-[#0F172A] text-lg lg:text-xl">
              Product Images
              <ChevronDown size={24} className="group-open:rotate-180 transition-transform text-[#64748B]" />
            </summary>
            <div className="p-5 border-t border-[#E2E8F0] bg-white space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
                {images.map((url) => (
                  <div key={url} className={`relative aspect-square w-full rounded-2xl border-[3px] overflow-hidden group ${primaryImage === url ? 'border-[#0A4DA3]' : 'border-transparent'}`}>
                    <img src={url} alt="Product" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button onClick={() => setPrimaryImage(url)} className="p-2.5 bg-white text-[#0A4DA3] rounded-xl shadow-lg border border-transparent hover:scale-110 transition-transform">
                        <Check size={18} />
                      </button>
                      <button onClick={() => handleRemoveImage(url)} className="p-2.5 bg-white text-red-500 rounded-xl shadow-lg border border-transparent hover:scale-110 transition-transform">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    {primaryImage === url && (
                      <div className="absolute top-2 left-2 bg-[#0A4DA3] text-white text-[10px] px-2 py-1 rounded-[6px] font-bold shadow-md">
                        Main
                      </div>
                    )}
                  </div>
                ))}
                
                <label className="aspect-square w-full rounded-2xl border-[3px] border-dashed border-[#E2E8F0] hover:border-[#0A4DA3] transition-all bg-[#F8FAFC] flex flex-col items-center justify-center text-[#64748B] hover:text-[#0A4DA3] cursor-pointer min-h-[120px] min-w-[120px]">
                  {uploading ? <Loader2 className="animate-spin" size={28} /> : <Upload size={28} className="mb-2" />}
                  <span className="text-[12px] font-bold">{uploading ? "Uploading..." : "Upload Images"}</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
              <p className="text-[13px] font-medium text-[#64748B]">Click the checkmark overlay to set main display image.</p>
            </div>
          </details>

          {/* Accordion: SEO Settings */}
          <details className="bg-white rounded-[20px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-[#E2E8F0] group overflow-hidden">
            <summary className="p-5 md:p-6 cursor-pointer list-none flex justify-between items-center bg-white hover:bg-[#F8FAFC] transition-colors select-none font-bold text-[#0F172A] text-lg lg:text-xl">
              SEO Settings
              <ChevronDown size={24} className="group-open:rotate-180 transition-transform text-[#64748B]" />
            </summary>
            <div className="p-5 border-t border-[#E2E8F0] bg-white space-y-4">
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#0F172A]">Meta Title</label>
                <input 
                  type="text" 
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-4 py-3.5 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#0A4DA3] text-[16px]"
                  placeholder="SEO title..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[14px] font-semibold text-[#0F172A]">Meta Description</label>
                <textarea 
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-4 py-3.5 border border-[#E2E8F0] rounded-xl outline-none focus:ring-2 focus:ring-[#0A4DA3] resize-none text-[16px]"
                  placeholder="SEO description..."
                />
              </div>
            </div>
          </details>
        </div>
      </div>

    </div>
  );
}
