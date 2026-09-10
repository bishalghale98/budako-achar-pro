export interface ContactInfo {
  location: string;
  phone: string;
  whatsapp: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  message: string;
}

export const contactInfo: ContactInfo = {
  location: "Sangeet Chowk, Itahari, Koshi Province, Nepal",
  phone: "982-7078809",
  whatsapp: "9827078809",
};

export const contactPage = {
  tagline: "Get in Touch",
  heading: "Contact Buda Ko Achar",
  description: "Have questions or want to place an order? Reach out to us directly.",
  mapPlaceholder: "Sangeet Chowk, Itahari Map Location Placeholder",
};
