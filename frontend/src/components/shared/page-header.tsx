import { cn } from "cn";

type Align = "left" | "center" | "right";

interface PageHeaderProps {
  title: string;
  description?: string;
  align?: Align;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
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
