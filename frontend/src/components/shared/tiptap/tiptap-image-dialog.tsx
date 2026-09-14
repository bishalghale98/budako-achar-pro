"use client";

import { useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ImageIcon, Upload, X } from "lucide-react";
import { cn } from "cn";

interface TiptapImageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (src: string, alt: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export function TiptapImageDialog({
  open,
  onOpenChange,
  onInsert,
  onImageUpload,
}: TiptapImageDialogProps) {
  const [alt, setAlt] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setAlt("");
    setFile(null);
    setPreview(null);
    setError(null);
    setUploading(false);
  }, []);

  const handleOpenChange = useCallback(
    (value: boolean) => {
      if (!value) reset();
      onOpenChange(value);
    },
    [onOpenChange, reset]
  );

  const validateFile = useCallback((f: File): string | null => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      return "Only JPEG, PNG, and WebP images are allowed.";
    }
    if (f.size > MAX_SIZE) {
      return "Image must be smaller than 5MB.";
    }
    return null;
  }, []);

  const handleFile = useCallback(
    (f: File) => {
      const err = validateFile(f);
      if (err) {
        setError(err);
        return;
      }
      setError(null);
      setFile(f);
      setPreview(URL.createObjectURL(f));
    },
    [validateFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  const handleInsert = useCallback(async () => {
    if (!file) return;
    if (!alt.trim()) {
      setError("Alt text is required.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      if (!onImageUpload) {
        throw new Error("Image upload is not configured");
      }
      const src = await onImageUpload(file);
      onInsert(src, alt.trim());
      handleOpenChange(false);
    } catch {
      setError("Upload failed. Please try again.");
      setUploading(false);
    }
  }, [file, alt, onImageUpload, onInsert, handleOpenChange]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 cursor-pointer transition-colors",
              dragOver
                ? "border-maroon bg-maroon/5"
                : "border-border hover:border-maroon/50 hover:bg-muted/50"
            )}
          >
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-40 rounded-md object-contain"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setPreview(null);
                  }}
                  className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center"
                >
                  <X className="size-3" />
                </button>
              </div>
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  {dragOver ? (
                    <Upload className="size-5 text-muted-foreground" />
                  ) : (
                    <ImageIcon className="size-5 text-muted-foreground" />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Drag and drop or{" "}
                    <span className="text-maroon font-medium">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPEG, PNG, WebP up to 5MB
                  </p>
                </div>
              </>
            )}
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
              className="hidden"
            />
          </div>

          {file && (
            <p className="text-xs text-muted-foreground">
              {file.name} ({formatFileSize(file.size)})
            </p>
          )}

          {/* Alt text */}
          <div className="space-y-2">
            <Label htmlFor="image-alt" className="text-sm font-semibold">
              Alt text <span className="text-destructive">*</span>
            </Label>
            <Input
              id="image-alt"
              value={alt}
              onChange={(e) => {
                setAlt(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Describe this image"
              className="h-9 text-sm"
            />
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleInsert}
            disabled={!file || !alt.trim() || uploading}
            className="bg-maroon text-white hover:bg-maroon-hover"
          >
            {uploading ? "Uploading..." : "Insert"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
