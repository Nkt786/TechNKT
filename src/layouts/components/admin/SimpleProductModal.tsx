import React, { useState, useEffect } from "react";
import {
  LuX,
  LuUpload,
  LuCrop,
  LuCheck,
  LuEye,
  LuMonitor,
  LuSmartphone,
  LuShoppingCart,
  LuZap,
  LuShieldCheck,
  LuSparkles,
  LuTag,
  LuUser,
  LuClock,
  LuMessageSquare,
  LuPhone,
} from "react-icons/lu";
import ImageCropModal from "./ImageCropModal";

interface SimpleProductModalProps {
  product: any;
  isNew: boolean;
  sellerSuggestions: string[];
  onClose: () => void;
  onSaved: () => void;
  showToast: (msg: string, type?: "success" | "error") => void;
}

const CATEGORY_OPTIONS = [
  { id: "subscriptions", label: "Subscriptions (OTT & Cloud)" },
  { id: "combo-packs", label: "Combo Packs" },
  { id: "software", label: "Software & AI Tools" },
  { id: "music", label: "Music & Audio" },
  { id: "ebooks", label: "Ebooks & Courses" },
];

export default function SimpleProductModal({
  product,
  isNew,
  sellerSuggestions,
  onClose,
  onSaved,
  showToast,
}: SimpleProductModalProps) {
  // Extract initial values cleanly from product or its primary variant
  const initialVariant = product.variants?.[0] || {};
  const initialPrice =
    product.variants?.length
      ? Math.min(...product.variants.map((v: any) => v.price_amount))
      : product.price_amount !== undefined
      ? product.price_amount
      : "";

  const [name, setName] = useState<string>(product.name || "");
  const [imageUrl, setImageUrl] = useState<string>(product.image_url || "");
  const [sellingPrice, setSellingPrice] = useState<string>(
    initialPrice !== 0 && initialPrice !== "" ? String(initialPrice) : ""
  );
  const [description, setDescription] = useState<string>(
    product.description || product.short_description || ""
  );
  const [category, setCategory] = useState<string>(product.category_id || "subscriptions");
  const [duration, setDuration] = useState<string>(
    initialVariant.variant_name || initialVariant.duration_unit || ""
  );
  const [sellerName, setSellerName] = useState<string>(product.seller_name || "");

  // Preview Mode State: Desktop vs Mobile
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  // Crop tool state
  const [cropModalOpen, setCropModalOpen] = useState<boolean>(false);
  const [imageToCrop, setImageToCrop] = useState<string>("");

  // Saving states
  const [saving, setSaving] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  // File upload input trigger
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      showToast("Please upload a JPG, PNG, or WebP image", "error");
      return;
    }

    // Read as Data URL to open immediately in crop tool
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setImageToCrop(reader.result);
        setCropModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleCropComplete = async (croppedBlob: Blob, croppedDataUrl: string) => {
    // Set immediate preview
    setImageUrl(croppedDataUrl);

    // Upload to server storage in background
    try {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", croppedBlob, `crop_${Date.now()}.webp`);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
        showToast("Image cropped & saved successfully");
      }
    } catch (e) {
      console.warn("Storage upload note:", e);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (saveAsDraft = false) => {
    try {
      setSaving(true);

      const hasPrice = sellingPrice.trim() !== "" && !isNaN(Number(sellingPrice));
      const numericPrice = hasPrice ? Math.max(0, Number(sellingPrice)) : null;

      // Status logic: if explicitly draft or if title/image missing, draft
      const isComplete = name.trim().length > 0 && imageUrl.trim().length > 0;
      const finalStatus = saveAsDraft || !isComplete ? "draft" : "active";

      const payload = {
        name: name.trim(),
        image_url: imageUrl.trim() || undefined,
        category_id: category,
        description: description.trim() || undefined,
        short_description: description.trim() ? description.trim().slice(0, 160) : undefined,
        price: numericPrice,
        selling_price: numericPrice,
        duration: duration.trim() || undefined,
        seller_name: sellerName.trim() || undefined,
        status: finalStatus,
        save_as_draft: saveAsDraft,
      };

      const url = isNew ? "/api/admin/products" : `/api/admin/products/${product.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(
          finalStatus === "draft"
            ? "Product saved as Draft"
            : isNew
            ? "Product published successfully"
            : "Product updated successfully"
        );
        onSaved();
      } else {
        showToast(data.error || "Failed to save product", "error");
      }
    } catch {
      showToast("Network error saving product", "error");
    } finally {
      setSaving(false);
    }
  };

  // Dynamic preview calculations
  const parsedPrice = sellingPrice.trim() !== "" && !isNaN(Number(sellingPrice)) ? Number(sellingPrice) : null;
  const hasValidPrice = parsedPrice !== null && parsedPrice > 0;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        <div className="bg-[#151D2B] border border-[#1E2837] rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Top Header */}
          <div className="p-4 sm:p-5 border-b border-[#1E2837] flex items-center justify-between bg-[#111724]">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold">
                <LuTag className="size-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {isNew ? "Add New Product" : `Edit Product: ${name || "Untitled"}`}
                </h2>
                <p className="text-[11px] text-[#A6B1C2]">
                  Fill only the fields you need • All fields are optional • Live real-time preview
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A6B1C2] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              <LuX className="size-5" />
            </button>
          </div>

          {/* Body: Two Columns (Left Form 55%, Right Live Preview 45%) */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#1E2837]">
            
            {/* LEFT COLUMN: Straightforward Product Form */}
            <div className="lg:col-span-7 p-4 sm:p-6 space-y-4">
              
              {/* 1. Product Name */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  1. Product Name <span className="text-[#A6B1C2] font-normal text-[11px]">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Netflix, Spotify, Canva Pro, Prime Video"
                  className="w-full h-10 px-3.5 rounded-xl bg-[#0B101A] border border-[#1E2837] text-sm text-white placeholder-[#A6B1C2]/50 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* 2. Product Image & Crop Tool Trigger */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  2. Product Image <span className="text-[#A6B1C2] font-normal text-[11px]">(Optional • JPG, PNG, WebP)</span>
                </label>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {/* Upload button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-4 py-2.5 rounded-xl bg-[#111724] hover:bg-[#1A2333] border border-[#1E2837] text-xs font-semibold text-white flex items-center justify-center gap-2 transition-all cursor-pointer hover:border-emerald-500/40"
                  >
                    <LuUpload className="size-4 text-emerald-400" />
                    <span>{uploading ? "Uploading..." : "Upload Image"}</span>
                  </button>

                  {/* Crop Image button if image exists */}
                  {imageUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageToCrop(imageUrl);
                        setCropModalOpen(true);
                      }}
                      className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-semibold text-emerald-400 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <LuCrop className="size-4" />
                      <span>Crop / Adjust Image</span>
                    </button>
                  )}

                  {/* Or image URL input */}
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Or paste image URL..."
                    className="flex-1 h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white placeholder-[#A6B1C2]/50 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* 3. Selling Price & Duration (2 Cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Selling Price */}
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    3. Selling Price (₹) <span className="text-[#A6B1C2] font-normal text-[11px]">(Optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-emerald-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      placeholder="e.g. 139"
                      className="w-full h-10 pl-8 pr-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-sm text-white placeholder-[#A6B1C2]/50 focus:outline-none focus:border-emerald-500 transition-colors font-mono font-bold"
                    />
                  </div>
                  <span className="text-[10px] text-[#A6B1C2]/70 mt-1 block">
                    If empty, shows &quot;Ask for Price&quot; with contact inquiry.
                  </span>
                </div>

                {/* Duration / Plan Details */}
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    6. Duration / Plan <span className="text-[#A6B1C2] font-normal text-[11px]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 1 Month, 1 Year, Lifetime"
                    className="w-full h-10 px-3.5 rounded-xl bg-[#0B101A] border border-[#1E2837] text-sm text-white placeholder-[#A6B1C2]/50 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* 4. Product Description */}
              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  4. Product Description <span className="text-[#A6B1C2] font-normal text-[11px]">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Ultra HD 4K, 1 Screen Private Profile with PIN, works on Mobile & Smart TV."
                  className="w-full p-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white placeholder-[#A6B1C2]/50 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                />
                <span className="text-[10px] text-[#A6B1C2]/70 mt-0.5 block">
                  Only actual text you type here will appear. No auto-generated text is invented.
                </span>
              </div>

              {/* 5. Category & 7. Seller Name (2 Cols) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-white mb-1.5">
                    5. Category <span className="text-[#A6B1C2] font-normal text-[11px]">(Optional)</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Seller Name with Suggestions */}
                <div>
                  <label className="block text-xs font-bold text-emerald-400 mb-1.5 flex items-center justify-between">
                    <span>7. Seller Name (Internal)</span>
                    <span className="text-[10px] text-[#A6B1C2] font-normal">Hidden from customers</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      list="seller-name-suggestions"
                      value={sellerName}
                      onChange={(e) => setSellerName(e.target.value)}
                      placeholder="e.g. Rahul, Amit, Suresh..."
                      className="w-full h-10 px-3.5 rounded-xl bg-[#0B101A] border border-emerald-500/40 text-sm text-white placeholder-[#A6B1C2]/50 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                    <datalist id="seller-name-suggestions">
                      {(sellerSuggestions || []).map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </div>
                  <span className="text-[10px] text-emerald-400/80 mt-1 block">
                    You can type any name freely. Appears automatically on new customer orders.
                  </span>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Real-Time Live TechNKT Card Preview */}
            <div className="lg:col-span-5 p-4 sm:p-6 bg-[#0E1522] flex flex-col justify-between">
              
              <div>
                {/* Preview Header & Viewport Switcher */}
                <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-[#1E2837]">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider">
                      <LuEye className="size-3.5 text-emerald-400" />
                      <span>How This Product Will Look on TechNKT</span>
                    </h3>
                    <p className="text-[10px] text-[#A6B1C2] mt-0.5">
                      Exact website styling &amp; card proportions
                    </p>
                  </div>

                  {/* Switcher: Desktop vs Mobile */}
                  <div className="flex items-center p-0.5 rounded-lg bg-[#0B101A] border border-[#1E2837]">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("desktop")}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                        previewMode === "desktop"
                          ? "bg-emerald-500 text-black font-bold"
                          : "text-[#A6B1C2] hover:text-white"
                      }`}
                      title="Desktop Card Preview"
                    >
                      <LuMonitor className="size-3" />
                      <span className="hidden sm:inline">Desktop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("mobile")}
                      className={`px-2.5 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                        previewMode === "mobile"
                          ? "bg-emerald-500 text-black font-bold"
                          : "text-[#A6B1C2] hover:text-white"
                      }`}
                      title="Mobile Card Preview"
                    >
                      <LuSmartphone className="size-3" />
                      <span className="hidden sm:inline">Mobile</span>
                    </button>
                  </div>
                </div>

                {/* Actual Live Card Mockup Container */}
                <div className="flex justify-center items-center py-4 px-2 min-h-[340px]">
                  
                  {/* TechNKT Product Card Replica */}
                  <div
                    style={{
                      width: previewMode === "desktop" ? "270px" : "180px",
                    }}
                    className="group relative flex flex-col justify-between rounded-xl sm:rounded-2xl p-2.5 sm:p-3.5 bg-[#151D2B] border border-[#1E2837] shadow-xl transition-all duration-200"
                  >
                    <div>
                      {/* Image Artwork Container (aspect-square) */}
                      <div className="relative w-full aspect-square rounded-lg sm:rounded-xl overflow-hidden mb-2.5 bg-[#0B101A] border border-white/5 flex items-center justify-center">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={name || "Product Artwork"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="text-center p-3 text-[#A6B1C2]/60 flex flex-col items-center gap-1">
                            <LuSparkles className="size-6 text-emerald-400/40" />
                            <span className="text-[10px]">No image yet</span>
                          </div>
                        )}

                        {/* Instant Badge */}
                        <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded bg-black/85 backdrop-blur-md border border-amber-400/40 text-[9px] font-bold text-amber-300 flex items-center gap-0.5">
                          <LuZap className="size-2.5 text-amber-400" />
                          <span>INSTANT</span>
                        </div>
                      </div>

                      {/* Product Title (Only actual name provided) */}
                      <h4 className="text-xs sm:text-sm font-semibold text-[#F4F6FA] mb-1 line-clamp-1 leading-snug">
                        {name || <span className="text-[#A6B1C2]/50 italic">Product Name</span>}
                      </h4>

                      {/* Product Description (Only if provided) */}
                      {description.trim() ? (
                        <p className="text-[11px] sm:text-xs text-[#A6B1C2] line-clamp-2 leading-relaxed mb-2.5">
                          {description}
                        </p>
                      ) : null}

                      {/* Price & Duration Row */}
                      <div className="flex items-baseline gap-1.5 mb-3 flex-wrap">
                        {hasValidPrice ? (
                          <>
                            <span className="text-sm sm:text-base font-extrabold text-white">
                              ₹{parsedPrice}
                            </span>
                            {duration.trim() ? (
                              <span className="text-[10px] sm:text-[11px] text-[#A6B1C2]">
                                {duration.startsWith("/") ? duration : `/${duration}`}
                              </span>
                            ) : null}
                          </>
                        ) : (
                          <span className="text-xs font-bold text-emerald-400">
                            Ask for Price
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Exact TechNKT buttons */}
                    <div className="flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-white/[0.04]">
                      {hasValidPrice ? (
                        <>
                          <div className="size-8 sm:size-9 rounded-lg border border-white/10 bg-white/[0.04] text-[#F4F6FA] flex items-center justify-center shrink-0">
                            <LuShoppingCart className="size-4" />
                          </div>
                          <div className="flex-1 h-8 sm:h-9 rounded-lg font-bold text-xs text-black bg-emerald-500 flex items-center justify-center gap-1 shadow-sm">
                            <LuZap className="size-3" />
                            <span>Buy now</span>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-8 sm:h-9 rounded-lg font-bold text-xs text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center gap-1">
                          <LuMessageSquare className="size-3.5" />
                          <span>Contact Us</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>

                {/* Privacy Assurance Box */}
                <div className="p-3 rounded-xl bg-[#0B101A] border border-[#1E2837] text-[11px] text-[#A6B1C2] space-y-1">
                  <div className="flex items-center gap-1.5 text-white font-semibold">
                    <LuShieldCheck className="size-4 text-emerald-400" />
                    <span>Customer Privacy Protected</span>
                  </div>
                  <p>
                    {sellerName ? (
                      <>
                        Seller &quot;<strong className="text-emerald-300">{sellerName}</strong>&quot; is strictly internal. Customers never see this.
                      </>
                    ) : (
                      "Seller name is optional and only shown in your admin orders."
                    )}
                  </p>
                </div>

              </div>

              {/* Bottom Preview State Summary */}
              <div className="pt-3 border-t border-[#1E2837] text-[11px] text-[#A6B1C2] flex items-center justify-between">
                <span>
                  Listing Status:{" "}
                  <strong className={name && imageUrl ? "text-emerald-400" : "text-amber-400"}>
                    {name && imageUrl ? "Ready to Publish" : "Will save as Draft"}
                  </strong>
                </span>
              </div>

            </div>

          </div>

          {/* Bottom Actions Bar */}
          <div className="p-4 sm:p-5 border-t border-[#1E2837] flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111724]">
            <div className="text-xs text-[#A6B1C2] text-center sm:text-left">
              {name && imageUrl ? (
                <span className="text-emerald-400 font-medium">✓ Required display info present</span>
              ) : (
                <span className="text-amber-400">
                  ℹ Incomplete entries are safely saved as drafts to prevent broken listings.
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-[#A6B1C2] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              {/* Save as Draft Button */}
              <button
                type="button"
                onClick={() => handleSave(true)}
                disabled={saving}
                className="px-4 py-2.5 rounded-xl bg-[#151D2B] hover:bg-[#1E2837] border border-[#1E2837] text-white text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
              >
                Save as Draft
              </button>

              {/* Save Product (Primary) */}
              <button
                type="button"
                onClick={() => handleSave(false)}
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <LuCheck className="size-4" />
                <span>{saving ? "Saving..." : "Save Product"}</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Image Crop Tool Modal */}
      {cropModalOpen && (
        <ImageCropModal
          imageUrl={imageToCrop}
          isOpen={cropModalOpen}
          onClose={() => setCropModalOpen(false)}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
}
