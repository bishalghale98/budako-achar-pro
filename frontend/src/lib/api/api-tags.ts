export const tagTypes = [
  "User",
  "Product",
  "Products",
  "Categories",
  "Reviews",
  "AdminProducts",
  "AdminVariants",
  "AdminImages",
  "AdminReviews",
  "AdminUsers",
] as const;
export type TagTypes = (typeof tagTypes)[number];
