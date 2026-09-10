import Link from "next/link";
import { MessageCircle } from "lucide-react";

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
  legal: [
    { href: "/terms", label: "Terms of Service" },
    { href: "/privacy", label: "Privacy Policy" },
  ],
};

export function PublicFooter() {
  return (
    <>
      <footer className="border-t border-gray-800 bg-dark-text py-16 text-gray-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link href="/" className="inline-block">
                <span className="font-serif text-xl font-bold text-white">
                  Buda Ko Achar
                </span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-400">
                Handcrafted, traditional Nepali achar made with love. Authentic
                recipes passed down through generations, bringing the true taste
                of Nepal to your table.
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
                {footerLinks.legal.map((link) => (
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
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm">
            <p>
              &copy; {new Date().getFullYear()} Buda Ko Achar. All rights
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
      <a
        href="https://wa.me/9779800000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-medium text-white shadow-lg transition hover:bg-[#20ba59]"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="size-5" />
        <span className="hidden sm:inline">Chat on WhatsApp</span>
      </a>
    </>
  );
}
