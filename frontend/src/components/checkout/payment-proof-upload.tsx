"use client";

import { useRef, useState } from "react";
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
      <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
        Payment Screenshot *
      </label>
      <div
        className={`border-2 border-dashed rounded-lg p-4 text-center transition ${
          error ? "border-red-400" : "border-gray-300 hover:border-maroon"
        }`}
      >
        {preview ? (
          <div className="space-y-3">
            <div className="relative w-32 h-32 mx-auto">
              <ImageIcon className="w-full h-full text-gray-300" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Payment proof"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="text-gray-600 truncate max-w-[200px]">
                {value?.name}
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="text-red-500 hover:text-red-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="space-y-2 text-gray-500 hover:text-maroon transition"
          >
            <Upload className="h-8 w-8 mx-auto" />
            <p className="text-sm">Click to upload payment screenshot</p>
            <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
