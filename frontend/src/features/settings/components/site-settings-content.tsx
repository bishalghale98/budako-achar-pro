"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetAdminSiteSettingsQuery,
  useUpdateSiteSettingsMutation,
} from "@/features/settings/settings-api";
import type { SiteSettings } from "@/features/settings/settings-types";

type SiteSettingsFormValues = Omit<SiteSettings, "id" | "created_at" | "updated_at" | "brand_logo" | "favicon" | "og_image">;

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getImageUrl(path: string | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${API_URL}/storage/${path}`;
}

export function SiteSettingsContent() {
  const { data: settingsData, isLoading } = useGetAdminSiteSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateSiteSettingsMutation();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const brandLogoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const ogImageRef = useRef<HTMLInputElement>(null);

  const settings = settingsData?.site_settings;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SiteSettingsFormValues>({
    defaultValues: {
      site_name: "",
      site_description: "",
      currency_code: "NPR",
      currency_symbol: "NPR",
      default_city: "",
      default_province: "",
      timezone: "Asia/Kathmandu",
      brand_name: "",
      brand_display_mode: "image",
      phone: "",
      whatsapp_number: "",
      email: "",
      address: "",
      google_maps_url: "",
      facebook_url: "",
      instagram_url: "",
      tiktok_url: "",
      youtube_url: "",
      meta_title: "",
      meta_description: "",
      footer_description: "",
      copyright_text: "",
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        site_name: settings.site_name,
        site_description: settings.site_description ?? "",
        currency_code: settings.currency_code,
        currency_symbol: settings.currency_symbol,
        default_city: settings.default_city ?? "",
        default_province: settings.default_province ?? "",
        timezone: settings.timezone,
        brand_name: settings.brand_name,
        brand_display_mode: settings.brand_display_mode,
        phone: settings.phone ?? "",
        whatsapp_number: settings.whatsapp_number ?? "",
        email: settings.email ?? "",
        address: settings.address ?? "",
        google_maps_url: settings.google_maps_url ?? "",
        facebook_url: settings.facebook_url ?? "",
        instagram_url: settings.instagram_url ?? "",
        tiktok_url: settings.tiktok_url ?? "",
        youtube_url: settings.youtube_url ?? "",
        meta_title: settings.meta_title ?? "",
        meta_description: settings.meta_description ?? "",
        footer_description: settings.footer_description ?? "",
        copyright_text: settings.copyright_text ?? "",
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: SiteSettingsFormValues) => {
    setSuccess(false);
    setError(null);

    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      if (brandLogoRef.current?.files?.[0]) {
        formData.append("brand_logo", brandLogoRef.current.files[0]);
      }
      if (faviconRef.current?.files?.[0]) {
        formData.append("favicon", faviconRef.current.files[0]);
      }
      if (ogImageRef.current?.files?.[0]) {
        formData.append("og_image", ogImageRef.current.files[0]);
      }

      await updateSettings(formData).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.data?.message || "Failed to update settings.");
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading settings...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {success && (
        <Alert>
          <AlertDescription>Settings updated successfully.</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* General */}
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="site_name">Site Name *</Label>
              <Input id="site_name" {...register("site_name", { required: "Required" })} />
              {errors.site_name && <p className="text-sm text-destructive">{errors.site_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand_name">Brand Name *</Label>
              <Input id="brand_name" {...register("brand_name", { required: "Required" })} />
              {errors.brand_name && <p className="text-sm text-destructive">{errors.brand_name.message}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="site_description">Site Description</Label>
            <Textarea id="site_description" {...register("site_description")} rows={2} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currency_code">Currency Code *</Label>
              <Input id="currency_code" {...register("currency_code", { required: "Required" })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency_symbol">Currency Symbol *</Label>
              <Input id="currency_symbol" {...register("currency_symbol", { required: "Required" })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone *</Label>
              <Input id="timezone" {...register("timezone", { required: "Required" })} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="default_city">Default City</Label>
              <Input id="default_city" {...register("default_city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default_province">Default Province</Label>
              <Input id="default_province" {...register("default_province")} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Brand Logo</Label>
              {settings?.brand_logo && (
                <div className="mb-2">
                  <img src={getImageUrl(settings.brand_logo)} alt="Current logo" className="h-12 w-auto object-contain" />
                </div>
              )}
              <input ref={brandLogoRef} type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-maroon/10 file:text-maroon hover:file:bg-maroon/20" />
              <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP. Max 2MB.</p>
            </div>
            <div className="space-y-2">
              <Label>Favicon</Label>
              {settings?.favicon && (
                <div className="mb-2">
                  <img src={getImageUrl(settings.favicon)} alt="Current favicon" className="h-8 w-8 object-contain" />
                </div>
              )}
              <input ref={faviconRef} type="file" accept="image/ico,image/png,image/svg+xml" className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-maroon/10 file:text-maroon hover:file:bg-maroon/20" />
              <p className="text-xs text-muted-foreground">ICO, PNG, or SVG. Max 512KB.</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Brand Display Mode</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" value="image" {...register("brand_display_mode")} className="accent-maroon" />
                <span className="text-sm">Show Logo Image</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" value="name" {...register("brand_display_mode")} className="accent-maroon" />
                <span className="text-sm">Show Brand Name</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
              <Input id="whatsapp_number" {...register("whatsapp_number")} placeholder="9827078809" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" {...register("address")} rows={2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="google_maps_url">Google Maps URL</Label>
            <Input id="google_maps_url" type="url" {...register("google_maps_url")} />
          </div>
        </CardContent>
      </Card>

      {/* Social */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook_url">Facebook URL</Label>
              <Input id="facebook_url" type="url" {...register("facebook_url")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram_url">Instagram URL</Label>
              <Input id="instagram_url" type="url" {...register("instagram_url")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok_url">TikTok URL</Label>
              <Input id="tiktok_url" type="url" {...register("tiktok_url")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube_url">YouTube URL</Label>
              <Input id="youtube_url" type="url" {...register("youtube_url")} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input id="meta_title" {...register("meta_title")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea id="meta_description" {...register("meta_description")} rows={2} />
          </div>
          <div className="space-y-2">
            <Label>OG Image</Label>
            {settings?.og_image && (
              <div className="mb-2">
                <img src={getImageUrl(settings.og_image)} alt="Current OG image" className="h-20 w-auto object-contain rounded" />
              </div>
            )}
            <input ref={ogImageRef} type="file" accept="image/jpeg,image/png,image/webp" className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-maroon/10 file:text-maroon hover:file:bg-maroon/20" />
            <p className="text-xs text-muted-foreground">JPEG, PNG, or WebP. Max 2MB.</p>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardHeader>
          <CardTitle>Footer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="footer_description">Footer Description</Label>
            <Textarea id="footer_description" {...register("footer_description")} rows={2} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="copyright_text">Copyright Text</Label>
            <Input id="copyright_text" {...register("copyright_text")} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSaving} className="bg-maroon hover:bg-maroon-hover">
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </form>
  );
}
