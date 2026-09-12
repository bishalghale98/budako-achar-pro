import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  baseUrl: string;
}

export function Pagination({ currentPage, lastPage, baseUrl }: PaginationProps) {
  if (lastPage <= 1) return null;

  return (
    <div className="flex justify-center gap-2 mt-8">
      {Array.from({ length: lastPage }, (_, i) => i + 1).map((p) => (
        <Link
          key={p}
          href={`${baseUrl}?page=${p}`}
          scroll={false}
        >
          <Button
            variant={p === currentPage ? "default" : "outline"}
            size="sm"
            className={p === currentPage ? "bg-maroon text-white hover:bg-maroon-hover" : ""}
          >
            {p}
          </Button>
        </Link>
      ))}
    </div>
  );
}
