import type { PolicySection } from "@/data/policies";

interface PolicyContentProps {
  title: string;
  lastUpdated: string;
  sections: PolicySection[];
}

export function PolicyContent({ title, lastUpdated, sections }: PolicyContentProps) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-3xl font-bold text-dark-text">
          {title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">Last updated: {lastUpdated}</p>
        <div className="prose prose-gray mt-8 max-w-none space-y-6 text-gray-600">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-serif text-xl font-bold text-dark-text">
                {section.title}
              </h2>
              <p>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
