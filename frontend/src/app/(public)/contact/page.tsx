import { AppBreadcrumb, PageHeader } from "@/components/shared";
import { StoreInfoCard, MapPlaceholder, ContactForm } from "@/components/contact";
import { getSiteSettings } from "@/lib/server/site-settings";

const FALLBACK_CONTACT = {
  heading: "Get in Touch",
  description: "Have questions about our products or need help with an order? We'd love to hear from you.",
  tagline: "We're here to help",
  mapPlaceholder: "Visit our store in Itahari, Koshi Province, Nepal",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const contactInfo = {
    phone: settings?.phone ?? null,
    whatsapp: settings?.whatsapp_number ?? null,
    email: settings?.email ?? null,
    address: settings?.address ?? null,
    mapsUrl: settings?.google_maps_url ?? null,
  };

  const contactPage = {
    heading: FALLBACK_CONTACT.heading,
    description: FALLBACK_CONTACT.description,
    tagline: FALLBACK_CONTACT.tagline,
    mapPlaceholder: FALLBACK_CONTACT.mapPlaceholder,
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <AppBreadcrumb items={[{ label: "Contact" }]} />
      <PageHeader
        title={contactPage.heading}
        description={contactPage.description}
        tagline={contactPage.tagline}
        align="center"
        className="max-w-2xl mx-auto mb-16"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
          <StoreInfoCard info={contactInfo} />
          <MapPlaceholder text={contactPage.mapPlaceholder} embedUrl={settings?.google_maps_url} />
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
