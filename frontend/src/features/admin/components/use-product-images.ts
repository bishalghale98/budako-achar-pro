"use client";

import { useState, useCallback, useEffect, useRef } from "react";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const MAX_IMAGES = 10;

export interface ImageEntry {
  file: File;
  preview: string;
  is_thumbnail: boolean;
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

  const handleImageSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const newErrors: string[] = [];
      const remainingSlots = MAX_IMAGES - images.length;
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
          is_thumbnail: images.length === 0 && newImages.length === 0,
        });
      }

      setImages((prev) => [...prev, ...newImages]);
      setImageErrors(newErrors);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    },
    [images.length]
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

  const setThumbnail = useCallback((index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, is_thumbnail: i === index }))
    );
  }, []);

  const clearErrors = useCallback(() => setImageErrors([]), []);

  return {
    images,
    imageErrors,
    fileInputRef,
    handleImageSelect,
    removeImage,
    setThumbnail,
    clearErrors,
  };
}
