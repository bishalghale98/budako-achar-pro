"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useGetSiteSettingsQuery } from "@/features/settings/settings-api";
import { useGetPublicPagesQuery } from "@/features/pages/pages-api";

const footerLinks = {
  shop: [
    { href: "/products", label: "All Products" },
    { href: "/products?category=经典", label: "Classic Achar" },
    { href: "/products?category=辛辣", label: "Spicy Achar" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ],
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export function PublicFooter() {
  const { data: settingsData } = useGetSiteSettingsQuery();
  const { data: pagesData } = useGetPublicPagesQuery();
  const settings = settingsData?.site_settings;
  const pages = pagesData?.pages ?? [];

  const brandName = settings?.brand_name || "Buda Ko Achar";
  const footerDescription = settings?.footer_description || "Handcrafted, traditional Nepali achar made with love. Authentic recipes passed down through generations, bringing the true taste of Nepal to your table.";
  const copyrightText = settings?.copyright_text || brandName;
  const whatsappNumber = settings?.whatsapp_number;

  return (
    <>
      <footer className="border-t border-gray-800 bg-dark-text py-16 text-gray-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-5">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="inline-block">
                <span className="font-serif text-xl font-bold text-white">
                  {brandName}
                </span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
                {footerDescription}
              </p>
            </div>

            {/* Shop */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-white">Shop</h3>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="mb-4 text-sm font-bold text-white">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pages (dynamic) */}
            {pages.length > 0 && (
              <div>
                <h3 className="mb-4 text-sm font-bold text-white">Pages</h3>
                <ul className="space-y-3">
                  {pages.map((page) => (
                    <li key={page.slug}>
                      <Link
                        href={`/pages/${page.slug}`}
                        className="text-sm transition hover:text-white"
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} {copyrightText}. All rights
              reserved.
            </p>
            <p className="mt-2 text-xs text-gray-500">
              Crafted with care by{" "}
              <a
                href="https://github.com/bishalghale98"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold/70 underline-offset-2 transition hover:text-gold hover:underline"
              >
                Bishal Ghale
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* WhatsApp FAB */}
      {whatsappNumber && (
        <Tooltip>
          <TooltipTrigger
            render={
              <a
                href={`https://wa.me/977${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
              />
            }
            className="fixed bottom-6 right-6 z-50 flex size-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:bg-[#20ba59]"
          >
            <MessageCircle className="size-5" />
          </TooltipTrigger>
          <TooltipContent side="top">Chat on WhatsApp</TooltipContent>
        </Tooltip>
      )}
    </>
  );
}
