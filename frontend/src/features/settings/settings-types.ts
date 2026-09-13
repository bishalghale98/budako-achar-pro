export type SiteSettings = {
  id: string;

  // General
  site_name: string;
  site_description: string | null;
  currency_code: string;
  currency_symbol: string;
  default_city: string | null;
  default_province: string | null;
  timezone: string;

  // Branding
  brand_name: string;
  brand_logo: string | null;
  favicon: string | null;
  brand_display_mode: "image" | "name";

  // Contact
  phone: string | null;
  whatsapp_number: string | null;
  email: string | null;
  address: string | null;
  google_maps_url: string | null;

  // Social
  facebook_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  youtube_url: string | null;

  // SEO
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;

  // Footer
  footer_description: string | null;
  copyright_text: string | null;

  created_at: string | null;
  updated_at: string | null;
};

export type PaymentSettings = {
  id: string;

  // Digital Payment
  digital_payment_account_name: string | null;
  digital_payment_wallet_number: string | null;
  digital_payment_qr_image: string | null;

  // Bank Transfer
  bank_name: string | null;
  bank_account_name: string | null;
  bank_account_number: string | null;
  bank_branch: string | null;
  bank_qr_image: string | null;

  created_at: string | null;
  updated_at: string | null;
};

export type OrderSettings = {
  id: string;
  delivery_fee: number;
  free_delivery_threshold: number | null;
  minimum_order_amount: number | null;
  created_at: string | null;
  updated_at: string | null;
};

export type SiteSettingsResponse = {
  success: boolean;
  site_settings: SiteSettings;
};

export type PaymentSettingsResponse = {
  success: boolean;
  payment_settings: PaymentSettings;
};

export type OrderSettingsResponse = {
  success: boolean;
  order_settings: OrderSettings;
};
