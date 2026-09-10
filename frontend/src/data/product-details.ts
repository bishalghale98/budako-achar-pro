export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductDetails {
  id: string;
  title: string;
  slug: string;
  rating: number;
  reviewCount: number;
  price: number;
  unit: string;
  description: string;
  images: ProductImage[];
  ingredients: string;
  storageInfo: string;
}

export const productDetails: ProductDetails = {
  id: "1",
  title: "Chicken Achar",
  slug: "chicken-achar",
  rating: 4.8,
  reviewCount: 12,
  price: 350,
  unit: "500g",
  description:
    "Rich and savory bone-in chicken pieces simmered in aromatic mustard oil, garlic paste, red chillies, and traditional Nepali spices. Crafted with care in Itahari for an authentic homemade taste.",
  images: [
    {
      src: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=800",
      alt: "Chicken Achar",
    },
    {
      src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=200",
      alt: "Chicken Achar thumbnail",
    },
  ],
  ingredients:
    "Chicken pieces, mustard oil, garlic, ginger, red chili powder, fenugreek, turmeric, salt, and proprietary spice mix.",
  storageInfo:
    "Store in a cool, dry place. Use a clean, dry spoon for serving. Keep tightly sealed.",
};
