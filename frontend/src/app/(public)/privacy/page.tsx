import { PolicyContent } from "@/components/shared";
import { privacyData } from "@/data/policies";

export default function PrivacyPage() {
  return (
    <PolicyContent
      title={privacyData.title}
      lastUpdated={privacyData.lastUpdated}
      sections={privacyData.sections}
    />
  );
}
