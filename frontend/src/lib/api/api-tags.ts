export const tagTypes = [
  "User",
  "Product",
  "Products",
  "Categories",
  "Reviews",
  "Cart",
  "Addresses",
  "AdminProducts",
  "AdminVariants",
  "AdminImages",
  "AdminReviews",
  "AdminUsers",
] as const;
export type TagTypes = (typeof tagTypes)[number];
