import { AppBreadcrumb, PageHeader } from "@/components/shared";
import { StoreInfoCard, MapPlaceholder, ContactForm } from "@/components/contact";
import { contactInfo, contactPage } from "@/data/contact";

export default function ContactPage() {
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
          <MapPlaceholder text={contactPage.mapPlaceholder} />
        </div>
        <ContactForm />
      </div>
    </main>
  );
}
