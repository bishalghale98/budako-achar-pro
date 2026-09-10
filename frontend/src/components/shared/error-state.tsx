import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export function ErrorState({
  message = "Something went wrong.",
  actionLabel,
  actionHref,
}: {
  message?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <p className="text-muted-foreground">{message}</p>
        {actionLabel && actionHref && (
          <Link href={actionHref} className={buttonVariants({ variant: "outline" })}>
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
