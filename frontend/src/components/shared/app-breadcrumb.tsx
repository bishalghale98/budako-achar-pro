import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbEntry {
  label: string;
  href?: string;
}

interface AppBreadcrumbProps {
  items: BreadcrumbEntry[];
}

export function AppBreadcrumb({ items }: AppBreadcrumbProps) {
  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href="/" />}>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return [
            <BreadcrumbItem key={`item-${i}`}>
              {isLast || !item.href ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<Link href={item.href} />}>
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>,
            !isLast ? <BreadcrumbSeparator key={`sep-${i}`} /> : null,
          ];
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
