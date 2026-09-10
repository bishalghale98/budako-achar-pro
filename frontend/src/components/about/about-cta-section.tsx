import Link from "next/link";

interface AboutCTASectionProps {
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

export function AboutCTASection({
  heading,
  description,
  buttonText,
  buttonLink,
}: AboutCTASectionProps) {
  return (
    <section className="bg-maroon py-16 text-white">
      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif text-3xl font-bold sm:text-4xl">
          {heading}
        </h2>
        <p className="mt-4 text-gray-200 max-w-xl mx-auto">{description}</p>
        <Link
          href={buttonLink}
          className="mt-8 inline-block rounded-lg bg-gold px-8 py-4 font-bold text-maroon shadow transition hover:brightness-110"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
