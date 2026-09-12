"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, X, Star } from "lucide-react";
import { MAX_IMAGES, type ImageEntry, type ExistingImage } from "./use-product-images";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface Props {
  images: ImageEntry[];
  existingImages: ExistingImage[];
  deletedImageIds: Set<string>;
  imageErrors: string[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onRemoveExistingImage: (id: string) => void;
  onSetThumbnail: (index: number) => void;
  onSetExistingThumbnail: (id: string) => void;
}

export function ProductImagesSection({
  images,
  existingImages,
  deletedImageIds,
  imageErrors,
  fileInputRef,
  onImageSelect,
  onRemoveImage,
  onRemoveExistingImage,
  onSetThumbnail,
  onSetExistingThumbnail,
}: Props) {
  const activeExisting = existingImages.filter((img) => !deletedImageIds.has(img.id));
  const totalImages = activeExisting.length + images.length;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="border-b border-border bg-gradient-to-r from-cream/30 to-card px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-maroon text-sm font-bold text-white shadow-sm">
            3
          </span>
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">
              Product Images
            </h2>
            <p className="text-xs text-muted-foreground">
              Upload photos from your computer
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 p-6">
        {imageErrors.length > 0 && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              {imageErrors.map((err, i) => (
                <p key={i}>{err}</p>
              ))}
            </AlertDescription>
          </Alert>
        )}

        {/* Upload Zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all ${
            totalImages >= MAX_IMAGES
              ? "border-border bg-muted cursor-not-allowed opacity-50"
              : "border-maroon/20 bg-cream/20 hover:border-maroon/40 hover:bg-cream/40"
          }`}
        >
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-maroon/10 text-maroon">
            <Upload className="h-6 w-6" />
          </div>
          <p className="mb-1 text-sm font-semibold text-foreground">
            Click to upload images
          </p>
          <p className="text-xs text-muted-foreground">
            JPEG, PNG, or WebP. Maximum 5MB per file.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {totalImages} / {MAX_IMAGES} images selected
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={onImageSelect}
          className="hidden"
        />

        {/* Existing Server Images */}
        {activeExisting.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {activeExisting.map((img) => (
              <div
                key={img.id}
                className={`group relative overflow-hidden rounded-xl border-2 bg-card transition-all ${
                  img.is_thumbnail
                    ? "border-maroon shadow-md shadow-maroon/10"
                    : "border-border hover:border-border"
                }`}
              >
                <div className="aspect-square relative bg-muted">
                  <Image
                    src={img.image_url}
                    alt="Product image"
                    className="h-full w-full object-cover"
                    fill
                    sizes="200px"
                  />
                  {img.is_thumbnail && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-maroon px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        <Star className="h-2.5 w-2.5 fill-current" />
                        Thumbnail
                      </span>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveExistingImage(img.id)}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="border-t border-border p-2.5">
                  <p className="truncate text-xs font-medium text-muted-foreground">
                    Existing image
                  </p>
                  {!img.is_thumbnail && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onSetExistingThumbnail(img.id)}
                      className="mt-1.5 text-xs font-semibold text-maroon hover:text-primary-hover h-auto p-0"
                    >
                      Set as Thumbnail
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* New Upload Previews */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((img, index) => (
              <div
                key={img.preview}
                className={`group relative overflow-hidden rounded-xl border-2 bg-card transition-all ${
                  img.is_thumbnail
                    ? "border-maroon shadow-md shadow-maroon/10"
                    : "border-border hover:border-border"
                }`}
              >
                <div className="aspect-square relative bg-muted">
                  <Image
                    src={img.preview}
                    alt={`Product image ${index + 1}`}
                    className="h-full w-full object-cover"
                    fill
                  />
                  {img.is_thumbnail && (
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-maroon px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                        <Star className="h-2.5 w-2.5 fill-current" />
                        Thumbnail
                      </span>
                    </div>
                  )}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveImage(index)}
                    className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="border-t border-border p-2.5">
                  <p className="truncate text-xs font-medium text-muted-foreground">
                    {img.file.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    {formatFileSize(img.file.size)}
                  </p>
                  {!img.is_thumbnail && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => onSetThumbnail(index)}
                      className="mt-1.5 text-xs font-semibold text-maroon hover:text-primary-hover h-auto p-0"
                    >
                      Set as Thumbnail
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
