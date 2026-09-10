import { PublicHeader } from "@/components/layout/public-header";
import { PublicFooter } from "@/components/layout/public-footer";
import { PublicOnlyGuard } from "@/features/auth/components/role-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicOnlyGuard>
      <PublicHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        {children}
      </main>
      <PublicFooter />
    </PublicOnlyGuard>
  );
}
