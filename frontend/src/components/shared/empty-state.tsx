import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function EmptyState({
  title = "Nothing here yet",
  description,
  actionLabel,
  actionHref,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
        {actionLabel && actionHref && (
          <Link href={actionHref} className={buttonVariants({ variant: "outline", size: "sm" })}>
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
