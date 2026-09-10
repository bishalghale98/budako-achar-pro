"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "cn";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-maroon flex items-center justify-center text-white shadow-sm group-hover:bg-maroon-hover transition">
              <Package className="w-6 h-6 text-gold" />
            </div>
            <div>
              <span className="font-serif text-xl font-bold text-maroon block leading-tight">
                Buda Ko Achar
              </span>
              <span className="text-xs text-gray-500 font-medium tracking-wide">
                Itahari, Nepal
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-gray-700">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "transition",
                  pathname === link.href
                    ? "text-maroon font-semibold"
                    : "hover:text-maroon"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 hover:text-maroon transition"
              aria-label="Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-gold text-maroon text-[10px] font-bold rounded-full flex items-center justify-center">
                2
              </span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-700 hover:text-maroon transition focus:outline-none"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "fixed inset-0 bg-black/40 z-[60] transition-opacity duration-300 md:hidden",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 z-[70] h-full w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="font-serif text-lg font-bold text-maroon">Menu</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-gray-700 hover:text-maroon transition focus:outline-none"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "block py-3 px-4 rounded-lg transition text-sm font-medium",
                pathname === link.href
                  ? "bg-maroon/10 text-maroon"
                  : "text-gray-700 hover:bg-gray-50 hover:text-maroon"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
