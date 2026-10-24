import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  LuX,
  LuZoomIn,
  LuZoomOut,
  LuRotateCcw,
  LuCheck,
  LuCrop,
  LuMove,
  LuSquare,
  LuRectangleHorizontal,
} from "react-icons/lu";

interface ImageCropModalProps {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedBlob: Blob, croppedDataUrl: string) => void;
}

type AspectRatioMode = "1:1" | "4:3" | "16:9";

export default function ImageCropModal({
  imageUrl,
  isOpen,
  onClose,
  onCropComplete,
}: ImageCropModalProps) {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>("1:1");
  const [zoom, setZoom] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load image
  useEffect(() => {
    if (!imageUrl || !isOpen) return;
    setImageLoaded(false);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      setNaturalSize({ w: img.naturalWidth, h: img.naturalHeight });
      setZoom(1);
      setOffset({ x: 0, y: 0 });
      setImageLoaded(true);
    };
    img.onerror = () => {
      // Handle cross-origin or local fallback
      const fallbackImg = new Image();
      fallbackImg.onload = () => {
        imageRef.current = fallbackImg;
        setNaturalSize({ w: fallbackImg.naturalWidth, h: fallbackImg.naturalHeight });
        setZoom(1);
        setOffset({ x: 0, y: 0 });
        setImageLoaded(true);
      };
      fallbackImg.src = imageUrl;
    };
    img.src = imageUrl;
  }, [imageUrl, isOpen]);

  // Compute crop box aspect ratio
  const getAspectNumeric = (ar: AspectRatioMode): number => {
    if (ar === "1:1") return 1;
    if (ar === "4:3") return 4 / 3;
    if (ar === "16:9") return 16 / 9;
    return 1;
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile/tablet admin
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleReset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // Apply crop and generate high-res clean blob
  const handleApplyCrop = useCallback(() => {
    if (!imageRef.current || !containerRef.current) return;

    const img = imageRef.current;
    const targetAspect = getAspectNumeric(aspectRatio);

    // High quality output dimensions
    const outputWidth = 800;
    const outputHeight = Math.round(outputWidth / targetAspect);

    const outCanvas = document.createElement("canvas");
    outCanvas.width = outputWidth;
    outCanvas.height = outputHeight;
    const ctx = outCanvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Fill background with subtle dark base in case of transparency
    ctx.fillStyle = "#0B101A";
    ctx.fillRect(0, 0, outputWidth, outputHeight);

    // Calculate crop viewport relative to container
    const containerBox = containerRef.current.getBoundingClientRect();
    const boxWidth = containerBox.width;
    const boxHeight = containerBox.height;

    // How the image is rendered in the interactive container
    const scale = Math.max(boxWidth / img.naturalWidth, boxHeight / img.naturalHeight) * zoom;
    const renderedW = img.naturalWidth * scale;
    const renderedH = img.naturalHeight * scale;

    // Relative offset from container center
    const centerX = boxWidth / 2 + offset.x;
    const centerY = boxHeight / 2 + offset.y;

    const imgTopLeftX = centerX - renderedW / 2;
    const imgTopLeftY = centerY - renderedH / 2;

    // Map container crop window [0..boxWidth, 0..boxHeight] to destination canvas
    const drawRatioX = outputWidth / boxWidth;
    const drawRatioY = outputHeight / boxHeight;

    ctx.drawImage(
      img,
      imgTopLeftX * drawRatioX,
      imgTopLeftY * drawRatioY,
      renderedW * drawRatioX,
      renderedH * drawRatioY
    );

    // Convert to webp/png blob
    outCanvas.toBlob(
      (blob) => {
        if (blob) {
          const dataUrl = outCanvas.toDataURL("image/webp", 0.92);
          onCropComplete(blob, dataUrl);
          onClose();
        }
      },
      "image/webp",
      0.92
    );
  }, [aspectRatio, zoom, offset, onCropComplete, onClose]);

  if (!isOpen) return null;

  const targetAspect = getAspectNumeric(aspectRatio);

  return (
    <div className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#151D2B] border border-[#1E2837] rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1E2837] flex items-center justify-between bg-[#111724]">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
              <LuCrop className="size-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">Crop &amp; Position Product Image</h3>
              <p className="text-[11px] text-[#A6B1C2]">Reposition, zoom, and select aspect ratio for TechNKT product cards</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#A6B1C2] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Cancel"
          >
            <LuX className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 flex flex-col items-center gap-4">
          
          {/* Aspect Ratio Selector Pills */}
          <div className="flex items-center gap-2 w-full justify-center">
            <span className="text-[11px] font-semibold text-[#A6B1C2] mr-1 hidden sm:inline">Card Ratio:</span>
            
            <button
              type="button"
              onClick={() => { setAspectRatio("1:1"); handleReset(); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                aspectRatio === "1:1"
                  ? "bg-emerald-500 text-black font-bold shadow-sm"
                  : "bg-[#0B101A] text-[#A6B1C2] hover:text-white border border-[#1E2837]"
              }`}
            >
              <LuSquare className="size-3.5" />
              <span>Square 1:1 (Recommended)</span>
            </button>

            <button
              type="button"
              onClick={() => { setAspectRatio("4:3"); handleReset(); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                aspectRatio === "4:3"
                  ? "bg-emerald-500 text-black font-bold shadow-sm"
                  : "bg-[#0B101A] text-[#A6B1C2] hover:text-white border border-[#1E2837]"
              }`}
            >
              <LuRectangleHorizontal className="size-3.5" />
              <span>4:3 Landscape</span>
            </button>

            <button
              type="button"
              onClick={() => { setAspectRatio("16:9"); handleReset(); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                aspectRatio === "16:9"
                  ? "bg-emerald-500 text-black font-bold shadow-sm"
                  : "bg-[#0B101A] text-[#A6B1C2] hover:text-white border border-[#1E2837]"
              }`}
            >
              <LuRectangleHorizontal className="size-3.5" />
              <span>16:9 Wide</span>
            </button>
          </div>

          {/* Interactive Crop Viewport */}
          <div className="relative w-full flex items-center justify-center p-3 bg-[#0B101A] rounded-xl border border-[#1E2837]">
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                aspectRatio: `${targetAspect}`,
                maxHeight: "360px",
                width: targetAspect >= 1 ? "100%" : "auto",
                maxWidth: "420px",
              }}
              className="relative overflow-hidden rounded-xl border-2 border-dashed border-emerald-400/80 bg-[#111724] shadow-inner cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
            >
              {imageLoaded && imageRef.current ? (
                <div
                  style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                    transition: isDragging ? "none" : "transform 0.08s ease-out",
                  }}
                  className="w-full h-full flex items-center justify-center pointer-events-none"
                >
                  <img
                    src={imageUrl}
                    alt="Crop preview"
                    className="max-w-none w-full h-full object-contain pointer-events-none"
                    draggable={false}
                  />
                </div>
              ) : (
                <div className="text-xs text-[#A6B1C2]">Loading image for crop...</div>
              )}

              {/* Center Crosshair / Drag Cue */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="p-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 text-white/70 opacity-40 hover:opacity-80 transition-opacity">
                  <LuMove className="size-4" />
                </div>
              </div>

              {/* Grid Overlay Guide */}
              <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 opacity-20 border border-white/20">
                <div className="border-r border-b border-white/40"></div>
                <div className="border-r border-b border-white/40"></div>
                <div className="border-b border-white/40"></div>
                <div className="border-r border-b border-white/40"></div>
                <div className="border-r border-b border-white/40"></div>
                <div className="border-b border-white/40"></div>
                <div className="border-r border-white/40"></div>
                <div className="border-r border-white/40"></div>
                <div></div>
              </div>
            </div>
          </div>

          {/* Zoom & Reset Controls */}
          <div className="w-full max-w-md flex items-center gap-3 bg-[#111724] px-4 py-2.5 rounded-xl border border-[#1E2837]">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.7, Number((z - 0.1).toFixed(2))))}
              className="p-1 rounded-lg text-[#A6B1C2] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Zoom out"
            >
              <LuZoomOut className="size-4" />
            </button>

            <input
              type="range"
              min="0.7"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="flex-1 accent-emerald-500 cursor-pointer h-1.5 bg-[#0B101A] rounded-lg"
            />

            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, Number((z + 0.1).toFixed(2))))}
              className="p-1 rounded-lg text-[#A6B1C2] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Zoom in"
            >
              <LuZoomIn className="size-4" />
            </button>

            <span className="text-[11px] font-mono text-emerald-400 min-w-[36px] text-right">
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              onClick={handleReset}
              className="ml-2 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-medium text-[#A6B1C2] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              title="Reset position and zoom"
            >
              <LuRotateCcw className="size-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#1E2837] flex items-center justify-between bg-[#111724]">
          <span className="text-[11px] text-[#A6B1C2] hidden sm:inline">
            Drag image to center • Zoom slider controls scale
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A6B1C2] hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
            >
              <LuCheck className="size-4" />
              <span>Apply Crop</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
