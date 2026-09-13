export { cn } from "cn";

export function formatPrice(price: number, currencyCode: string = "NPR"): string {
  return `${currencyCode} ${price.toLocaleString()}`;
}

export function formatDate(date: string, style: "short" | "long" = "short"): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: style === "long" ? "long" : "short",
    day: "numeric",
    year: "numeric",
  });
}
