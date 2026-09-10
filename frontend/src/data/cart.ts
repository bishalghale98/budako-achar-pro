export interface CartItem {
  id: string;
  title: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
  imageAlt: string;
}

export const cartItems: CartItem[] = [
  {
    id: "1",
    title: "Chicken Achar",
    variant: "500g Jar",
    price: 350,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=200",
    imageAlt: "Chicken Achar",
  },
  {
    id: "2",
    title: "Buff Achar",
    variant: "500g Jar",
    price: 400,
    quantity: 1,
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=200",
    imageAlt: "Buff Achar",
  },
];

export const cartPage = {
  heading: "Your Achar Basket",
};
