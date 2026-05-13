"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  X, 
  Plus, 
  Trash2, 
  Image as ImageIcon,
  Loader2,
  Check
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

    // Update images in product_images table
    // For simplicity, we'll delete and re-insert for editing, or just insert for new
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
    
    // Trigger revalidation for product pages
    fetch("/api/revalidate?path=/products").catch(console.error);
    fetch(`/api/revalidate?path=/products/${slug}`).catch(console.error);
    fetch("/api/revalidate?path=/").catch(console.error);

    router.push("/admin/products");
    router.refresh();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/products" className="bg-white p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-gray-500">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{isEditing ? "Edit Product" : "Add New Product"}</h1>
            <p className="text-gray-500">{isEditing ? "Update existing product details." : "Fill in the details to create a new catalog item."}</p>
          </div>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition-all flex items-center gap-2 disabled:opacity-70 shadow-lg shadow-primary/20"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          {isEditing ? "Update Product" : "Save Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Basic Information</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g. Precision Brass Hex Bolt"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Category</label>
                  <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none bg-white"
                  >
                    <option>Brass Components</option>
                    <option>Stainless Steel</option>
                    <option>Aluminum</option>
                    <option>Copper Components</option>
                    <option>Precision Turned Components</option>
                    <option>CNC Machined Parts</option>
                  </select>
                </div>
                <div className="flex gap-8 items-end pb-3">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                    <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">Featured</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                    <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">Active</span>
                  </label>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Short Description</label>
                <textarea 
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"
                  placeholder="A brief summary for product cards..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Full Description</label>
                <textarea 
                  rows={6}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  placeholder="Detailed product information..."
                />
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Pricing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Product Price</label>
                <input 
                  type="number" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g. 1500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Currency Symbol</label>
                <input 
                  type="text" 
                  value={pricePrefix}
                  onChange={(e) => setPricePrefix(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  placeholder="₹"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Price Unit</label>
                <input 
                  type="text" 
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  placeholder="e.g. Piece"
                />
              </div>
              <div className="flex items-end pb-3">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={showPrice} 
                    onChange={(e) => setShowPrice(e.target.checked)} 
                    className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" 
                  />
                  <span className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">Display Price</span>
                </label>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-xl font-bold text-gray-800">Specifications</h3>
              <button onClick={handleAddSpec} className="text-primary hover:text-secondary font-bold text-sm flex items-center gap-1">
                <Plus size={16} /> Add Field
              </button>
            </div>
            <div className="space-y-3">
              {specifications.map((spec, idx) => (
                <div key={idx} className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="Key (e.g. Material)" 
                    value={spec.key}
                    onChange={(e) => handleSpecChange(idx, 'key', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input 
                    type="text" 
                    placeholder="Value (e.g. Grade 304)" 
                    value={spec.value}
                    onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button onClick={() => handleRemoveSpec(idx)} className="text-gray-300 hover:text-red-500 p-2">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-bold text-gray-800">Key Features</h3>
                <button onClick={handleAddFeature} className="text-primary hover:text-secondary font-bold text-sm flex items-center gap-1">
                  <Plus size={16} /> Add
                </button>
              </div>
              <div className="space-y-3">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Feature..." 
                      value={feature}
                      onChange={(e) => handleFeatureChange(idx, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button onClick={() => handleRemoveFeature(idx)} className="text-gray-300 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex justify-between items-center border-b pb-4">
                <h3 className="text-xl font-bold text-gray-800">Applications</h3>
                <button onClick={handleAddApp} className="text-primary hover:text-secondary font-bold text-sm flex items-center gap-1">
                  <Plus size={16} /> Add
                </button>
              </div>
              <div className="space-y-3">
                {applications.map((app, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Application..." 
                      value={app}
                      onChange={(e) => handleAppChange(idx, e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button onClick={() => handleRemoveApp(idx)} className="text-gray-300 hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Right Column - Media */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Product Images</h3>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {images.map((url) => (
                  <div key={url} className={`relative h-24 w-24 rounded-xl border-2 overflow-hidden group ${primaryImage === url ? 'border-primary' : 'border-transparent'}`}>
                    <img src={url} alt="Product" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => setPrimaryImage(url)} className="p-1 bg-white text-primary rounded-md shadow-lg">
                        <Check size={14} />
                      </button>
                      <button onClick={() => handleRemoveImage(url)} className="p-1 bg-white text-red-500 rounded-md shadow-lg">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    {primaryImage === url && (
                      <div className="absolute top-1 left-1 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                        Main
                      </div>
                    )}
                  </div>
                ))}
                
                <label className="h-24 w-24 rounded-xl border-2 border-dashed border-gray-200 hover:border-primary transition-all flex flex-col items-center justify-center text-gray-400 hover:text-primary cursor-pointer">
                  {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                  <span className="text-[10px] font-bold mt-1">{uploading ? "Uploading..." : "Upload"}</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
              <p className="text-xs text-gray-500">Upload multiple images. Click the checkmark to set as primary image.</p>
            </div>
          </section>

          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xl font-bold text-gray-800 border-b pb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Meta Title</label>
                <input 
                  type="text" 
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary"
                  placeholder="SEO title..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Meta Description</label>
                <textarea 
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="SEO description..."
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
