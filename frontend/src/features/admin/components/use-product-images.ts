"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type { ProductImage } from "@/features/products/product-types";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGES = 10;

export interface ImageEntry {
  file: File;
  preview: string;
  is_thumbnail: boolean;
}

export interface ExistingImage {
  id: string;
  image_url: string;
  is_thumbnail: boolean;
  sort_order: number;
}

function validateImage(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return "Only JPEG, PNG, and WebP images are allowed";
  }
  if (file.size > MAX_FILE_SIZE) {
    return "File must be less than 5MB";
  }
  return null;
}

export function useProductImages() {
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<Set<string>>(new Set());
  const [thumbnailImageId, setThumbnailImageId] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (mountedRef.current) {
        images.forEach((img) => URL.revokeObjectURL(img.preview));
      }
    };
  }, []);

  const initExistingImages = useCallback((serverImages: ProductImage[]) => {
    const mapped = serverImages.map((img) => ({
      id: img.id,
      image_url: img.image_url,
      is_thumbnail: img.is_thumbnail,
      sort_order: img.sort_order,
    }));
    setExistingImages(mapped);

    const thumb = mapped.find((img) => img.is_thumbnail);
    setThumbnailImageId(thumb?.id ?? null);
    setDeletedImageIds(new Set());
  }, []);

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const totalImages = existingImages.length + images.length;
      const newErrors: string[] = [];
      const remainingSlots = MAX_IMAGES - totalImages;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      if (files.length > remainingSlots) {
        newErrors.push(
          `Maximum ${MAX_IMAGES} images allowed. Only ${remainingSlots} more can be added.`
        );
      }

      const newImages: ImageEntry[] = [];

      for (const file of filesToProcess) {
        const error = validateImage(file);
        if (error) {
          newErrors.push(`${file.name}: ${error}`);
          continue;
        }
        newImages.push({
          file,
          preview: URL.createObjectURL(file),
          is_thumbnail: totalImages === 0 && newImages.length === 0,
        });
      }

      setImages((prev) => [...prev, ...newImages]);
      setImageErrors(newErrors);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [existingImages.length, images.length]
  );

  const removeImage = useCallback((index: number) => {
    setImages((prev) => {
      const removed = prev[index];
      URL.revokeObjectURL(removed.preview);
      const next = prev.filter((_, i) => i !== index);
      if (removed.is_thumbnail && next.length > 0) {
        next[0] = { ...next[0], is_thumbnail: true };
      }
      return next;
    });
  }, []);

  const removeExistingImage = useCallback((id: string) => {
    setExistingImages((prev) => {
      const next = prev.filter((img) => img.id !== id);
      if (thumbnailImageId === id && next.length > 0) {
        setThumbnailImageId(next[0].id);
      }
      return next;
    });
    setDeletedImageIds((prev) => new Set(prev).add(id));
  }, [thumbnailImageId]);

  const setThumbnail = useCallback((index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, is_thumbnail: i === index }))
    );
    setThumbnailImageId(null);
  }, []);

  const setExistingThumbnail = useCallback((id: string) => {
    setExistingImages((prev) =>
      prev.map((img) => ({ ...img, is_thumbnail: img.id === id }))
    );
    setThumbnailImageId(id);
    setImages((prev) =>
      prev.map((img) => ({ ...img, is_thumbnail: false }))
    );
  }, []);

  const clearErrors = useCallback(() => setImageErrors([]), []);

  return {
    images,
    existingImages,
    deletedImageIds,
    thumbnailImageId,
    imageErrors,
    fileInputRef,
    initExistingImages,
    handleImageSelect,
    removeImage,
    removeExistingImage,
    setThumbnail,
    setExistingThumbnail,
    clearErrors,
  };
}
