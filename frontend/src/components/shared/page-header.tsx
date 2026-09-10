import { cn } from "cn";

type Align = "left" | "center" | "right";

interface PageHeaderProps {
  title: string;
  description?: string;
  tagline?: string;
  align?: Align;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  tagline,
  align = "left",
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8",
        align === "center" && "text-center",
        align === "right" && "text-right",
        className
      )}
    >
      {tagline && (
        <span className="text-maroon font-semibold text-sm tracking-wider uppercase">
          {tagline}
        </span>
      )}
      <h1 className="font-serif text-3xl lg:text-4xl font-bold text-darkText">
        {title}
      </h1>
      {description && (
        <p className="text-gray-600 mt-2">{description}</p>
      )}
      {children && (
        <div className={cn("mt-4", align === "center" && "flex justify-center", align === "right" && "flex justify-end")}>
          {children}
        </div>
      )}
    </div>
  );
}
