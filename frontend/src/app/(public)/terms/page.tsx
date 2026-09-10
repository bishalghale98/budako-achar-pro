import { PolicyContent } from "@/components/shared";
import { termsData } from "@/data/policies";

export default function TermsPage() {
  return (
    <PolicyContent
      title={termsData.title}
      lastUpdated={termsData.lastUpdated}
      sections={termsData.sections}
    />
  );
}
