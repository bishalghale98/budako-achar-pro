import { PublicFooter } from "@/components/layout/public-footer";
import { PublicHeader } from "@/components/layout/public-header";
import { PublicOnlyGuard } from "@/features/auth/components/role-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicOnlyGuard>
      <PublicHeader />
      <main className="flex flex-1 items-center justify-center px-4 py-12 bg-[#FAF8F5]">
        {children}
      </main>
      <PublicFooter />
    </PublicOnlyGuard>
  );
}
