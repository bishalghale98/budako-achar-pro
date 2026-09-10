export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  rating: number;
  image: string;
  alt: string;
  featured: boolean;
}

export const categories: Category[] = [
  { id: "all", name: "All Achar", slug: "all", count: 6 },
  { id: "meat", name: "Meat Achar", slug: "meat", count: 3 },
  { id: "traditional", name: "Traditional Achar", slug: "traditional", count: 2 },
  { id: "vegetarian", name: "Vegetarian Achar", slug: "vegetarian", count: 1 },
  { id: "special", name: "Special Achar", slug: "special", count: 1 },
];

export const sortOptions = [
  "Featured",
  "Price: Low to High",
  "Price: High to Low",
  "Name",
];

export const products: Product[] = [
  {
    id: "1",
    title: "Chicken Achar",
    slug: "chicken-achar",
    category: "meat",
    description: "Rich and spicy home recipe.",
    price: 350,
    unit: "500g",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=500",
    alt: "Chicken Achar",
    featured: true,
  },
  {
    id: "2",
    title: "Buff Achar",
    slug: "buff-achar",
    category: "meat",
    description: "Chewy buff meat cured with local spices.",
    price: 400,
    unit: "500g",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=500",
    alt: "Buff Achar",
    featured: true,
  },
  {
    id: "3",
    title: "Mutton Achar",
    slug: "mutton-achar",
    category: "meat",
    description: "Premium tender mutton cuts.",
    price: 450,
    unit: "500g",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&q=80&w=500",
    alt: "Mutton Achar",
    featured: true,
  },
  {
    id: "4",
    title: "Lapsi Achar",
    slug: "lapsi-achar",
    category: "traditional",
    description: "Sweet & tangy hog plum pickle.",
    price: 300,
    unit: "500g",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=500",
    alt: "Lapsi Achar",
    featured: false,
  },
  {
    id: "5",
    title: "Timur Achar",
    slug: "timur-achar",
    category: "special",
    description: "Pungent citrusy Szechuan pepper pickle.",
    price: 280,
    unit: "500g",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&q=80&w=500",
    alt: "Timur Achar",
    featured: false,
  },
  {
    id: "6",
    title: "Mixed Achar",
    slug: "mixed-achar",
    category: "traditional",
    description: "Assorted traditional spice blend.",
    price: 320,
    unit: "500g",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=500",
    alt: "Mixed Achar",
    featured: false,
  },
];
