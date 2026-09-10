export const tagTypes = ["User"] as const;
export type TagTypes = (typeof tagTypes)[number];
