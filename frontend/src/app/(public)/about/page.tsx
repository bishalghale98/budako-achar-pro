import { AppBreadcrumb } from "@/components/shared";
import {
  AboutHeroSection,
  BrandStorySection,
  TimelineSection,
  ValuesSection,
  AboutCTASection,
} from "@/components/about";
import { hero, brandStory, timeline, values, cta } from "@/data/about";

export default function AboutPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <AppBreadcrumb items={[{ label: "About" }]} />
      </div>
      <AboutHeroSection data={hero} />
      <BrandStorySection data={brandStory} />
      <TimelineSection items={timeline} />
      <ValuesSection items={values} />
      <AboutCTASection
        heading={cta.heading}
        description={cta.description}
        buttonText={cta.buttonText}
        buttonLink={cta.buttonLink}
      />
    </>
  );
}
