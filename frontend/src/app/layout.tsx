import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/store/provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSiteSettingsForMetadata } from "@/lib/server/site-settings";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const FALLBACK_TITLE = "Buda Ko Achar — Authentic Nepali Pickles";
const FALLBACK_DESCRIPTION =
  "Handcrafted, traditional Nepali achar made with love. Explore our range of authentic pickles.";
const FALLBACK_FAVICON = "/logos/facivon logo.png";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettingsForMetadata();

  return {
    title: settings?.meta_title || FALLBACK_TITLE,
    description: settings?.meta_description || FALLBACK_DESCRIPTION,
    icons: {
      icon: settings?.favicon || FALLBACK_FAVICON,
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
          <TooltipProvider>{children}</TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
