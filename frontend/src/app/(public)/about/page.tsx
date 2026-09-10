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
