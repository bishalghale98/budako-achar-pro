"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-hooks";
import { useGetCartQuery } from "@/features/cart";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const pathname = usePathname();
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const { user } = useAuth();
  const { data: cartData } = useGetCartQuery();
  const cart = cartData?.cart;
  const cartCount = cart?.total_quantity ?? 0;

  const openCart = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setCartOpen(true);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setCartOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <Image
              src="/logos/primary logo.png"
              alt="Buda Ko Achar"
              width={180}
              height={48}
              className="h-10 w-auto"
              priority
            />
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
          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/customer"
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium bg-maroon text-white rounded-lg hover:bg-maroon-hover transition"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-700 hover:text-maroon transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-medium bg-maroon text-white rounded-lg hover:bg-maroon-hover transition"
                >
                  Register
                </Link>
              </>
            )}

            {/* Cart Icon with Mini-Cart Dropdown */}
            <div
              className="relative"
              onMouseEnter={openCart}
              onMouseLeave={scheduleClose}
            >
              <Link
                href="/cart"
                className="relative p-2 text-gray-700 hover:text-maroon transition"
                aria-label="Cart"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-5 right-0 w-4 h-4 bg-gold text-maroon text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mini-Cart Dropdown — desktop only */}
              {cart && cart.items.length > 0 && cartOpen && (
                <div className="hidden md:block absolute right-0 top-full pt-2 z-50">
                  <div className="w-80 bg-white rounded-xl border border-gray-200 shadow-lg">
                    <div className="p-4 space-y-3">
                      <p className="text-sm font-bold text-darkText">
                        {cart.item_count} {cart.item_count === 1 ? "item" : "items"} in cart
                      </p>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {cart.items.slice(0, 3).map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                              {item.product.thumbnail_url ? (
                                <Image
                                  src={item.product.thumbnail_url}
                                  alt={item.product.title}
                                  fill
                                  className="object-cover"
                                  sizes="40px"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-[8px]">
                                  No img
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-darkText truncate">
                                {item.product.title}
                              </p>
                              <p className="text-[10px] text-gray-500">
                                {item.variant.name} &middot; x{item.quantity}
                              </p>
                            </div>
                            <p className="text-xs font-bold text-maroon">
                              NPR {item.subtotal}
                            </p>
                          </div>
                        ))}
                        {cart.items.length > 3 && (
                          <p className="text-[10px] text-gray-400 text-center">
                            +{cart.items.length - 3} more
                          </p>
                        )}
                      </div>
                      <div className="pt-2 border-t border-gray-100 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Subtotal</span>
                          <span className="font-bold text-darkText">NPR {cart.subtotal}</span>
                        </div>
                        <Link
                          href="/cart"
                          className="block w-full py-2 bg-maroon text-white text-sm font-medium text-center rounded-lg hover:bg-maroon-hover transition"
                        >
                          View Cart
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden text-gray-700 hover:text-maroon"
              aria-label="Toggle Menu"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "fixed inset-0 bg-black/40 z-60 transition-opacity duration-300 md:hidden",
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 z-70 h-full w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="font-serif text-lg font-bold text-maroon">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 text-gray-700 hover:text-maroon transition focus:outline-none"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </Button>
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
        <div className="border-t border-gray-100 p-4 space-y-2">
          {user ? (
            <Link
              href="/customer"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center py-2.5 text-sm font-medium bg-maroon text-white rounded-lg hover:bg-maroon-hover transition"
            >
              Customer
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center py-2.5 text-sm font-medium bg-maroon text-white rounded-lg hover:bg-maroon-hover transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
