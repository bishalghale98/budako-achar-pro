"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface PaymentProofUploadProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export function PaymentProofUpload({
  value,
  onChange,
  error,
}: PaymentProofUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div>
      <Label className="block text-xs font-bold uppercase text-gray-500 mb-1">
        Payment Screenshot *
      </Label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition ${
          error ? "border-destructive" : "border-border hover:border-maroon"
        }`}
      >
        {preview ? (
          <div className="space-y-3">
            <div className="relative w-32 h-32 mx-auto">
              <ImageIcon className="w-full h-full text-muted-foreground" />
              <Image
                src={preview}
                alt="Payment proof"
                className="absolute inset-0 w-full h-full object-contain"
                fill
              />
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-muted-foreground truncate max-w-[200px]">
                {value?.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={handleRemove}
                className="text-destructive hover:text-destructive/80"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="ghost"
            onClick={() => inputRef.current?.click()}
            className="space-y-2 text-muted-foreground hover:text-maroon h-auto py-4 flex-col"
          >
            <Upload className="h-8 w-8" />
            <p className="text-sm">Click to upload payment screenshot</p>
            <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
          </Button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}
