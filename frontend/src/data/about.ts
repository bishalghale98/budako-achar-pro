import { Heart, Users, Leaf, Award } from "lucide-react";

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface ValueItem {
  icon: typeof Heart;
  title: string;
  description: string;
}

export interface AboutHero {
  tagline: string;
  heading: string;
  description: string;
  image: string;
  imageAlt: string;
}

export interface BrandStory {
  tagline: string;
  heading: string;
  paragraphs: string[];
  image: string;
  imageAlt: string;
}

export const hero: AboutHero = {
  tagline: "About Us",
  heading: "A Legacy of Authentic Nepali Flavors",
  description:
    "Buda Ko Achar is more than a brand — it's a story of tradition, love, and the authentic taste of Nepal. What started in a small kitchen has become a beloved name in Nepali households.",
  image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
  imageAlt: "Our kitchen",
};

export const brandStory: BrandStory = {
  tagline: "Our Story",
  heading: "From Grandma's Kitchen to Your Table",
  paragraphs: [
    "In the heart of Kathmandu, our grandmother spent her mornings in a small kitchen, grinding spices and mixing ingredients to create the most flavorful achar. Her secret? Love, patience, and recipes that had been perfected over generations.",
    "When she passed these recipes to her children, they carried forward not just a tradition, but a legacy. Today, Buda Ko Achar honors that legacy by bringing you the same authentic taste, made with the same dedication and care.",
    "We believe that food is more than sustenance — it's a connection to our roots, our culture, and our loved ones. Every jar of our achar carries a piece of that tradition.",
  ],
  image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
  imageAlt: "Our story",
};

export const timeline: TimelineItem[] = [
  {
    year: "1995",
    title: "The Beginning",
    description:
      "Grandmother started making achar in her small kitchen in Kathmandu, using recipes passed down for generations.",
  },
  {
    year: "2005",
    title: "Family Tradition",
    description:
      "The recipes were handed down to the next generation, preserving the authentic flavors and traditional methods.",
  },
  {
    year: "2015",
    title: "Buda Ko Achar Founded",
    description:
      "What was a family tradition became a brand. We started sharing our achar with friends and neighbors.",
  },
  {
    year: "2020",
    title: "Growing Nationwide",
    description:
      "With increasing demand, we expanded our kitchen and started delivering across Nepal.",
  },
  {
    year: "Today",
    title: "Serving Thousands",
    description:
      "Buda Ko Achar now serves thousands of happy customers, bringing authentic Nepali flavors to tables nationwide.",
  },
];

export const values: ValueItem[] = [
  {
    icon: Heart,
    title: "Made with Love",
    description:
      "Every jar is crafted with the same love and care as our grandmother's kitchen.",
  },
  {
    icon: Leaf,
    title: "Natural Ingredients",
    description:
      "We use only the finest, locally-sourced ingredients with no artificial preservatives.",
  },
  {
    icon: Users,
    title: "Community First",
    description:
      "We support local farmers and communities through fair trade practices.",
  },
  {
    icon: Award,
    title: "Quality Guaranteed",
    description:
      "Our strict quality standards ensure you get the best product every time.",
  },
];

export const cta = {
  heading: "Taste the Difference",
  description:
    "Experience the authentic flavors of traditional Nepali achar. Order now and bring home the taste of tradition.",
  buttonText: "Shop Now",
  buttonLink: "/products",
};
