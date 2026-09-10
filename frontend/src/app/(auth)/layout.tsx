import { Header } from "@/components/layout/header";
import { PublicOnlyGuard } from "@/features/auth/components/role-guard";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PublicOnlyGuard>
      <Header />
      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:py-12">
        {children}
      </main>
    </PublicOnlyGuard>
  );
}
