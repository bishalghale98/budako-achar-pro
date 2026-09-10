"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Package, ShoppingBag, Menu, X } from "lucide-react";

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
          <Link href="/" className="text-maroon font-semibold transition">
            Home
          </Link>
          <Link href="/products" className="hover:text-maroon transition">
            Products
          </Link>
          <Link href="/about" className="hover:text-maroon transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-maroon transition">
            Contact
          </Link>
        </nav>

        {/* Actions (Search, Cart, Mobile Menu Button) */}
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-maroon transition focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-3">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-maroon font-semibold border-b border-gray-100"
          >
            Home
          </Link>
          <Link
            href="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-700 border-b border-gray-100"
          >
            Products
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-700 border-b border-gray-100"
          >
            About
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-gray-700"
          >
            Contact
          </Link>
        </div>
      )}
    </header>
  );
}