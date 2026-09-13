"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/features/auth/auth-hooks";
import { useGetCartQuery } from "@/features/cart";
import { useGetSiteSettingsQuery } from "@/features/settings/settings-api";

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
  const { data: settingsData } = useGetSiteSettingsQuery();
  const settings = settingsData?.site_settings;
  const cart = cartData?.cart;
  const cartCount = cart?.total_quantity ?? 0;

  const openCart = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setCartOpen(true);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setCartOpen(false), 150);
  };

  React.useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          {settings?.brand_display_mode === "image" && settings?.brand_logo ? (
            <Image
              src={settings.brand_logo.startsWith("http") ? settings.brand_logo : `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/storage/${settings.brand_logo}`}
              alt={settings?.brand_name || "Buda Ko Achar"}
              width={180}
              height={48}
              className="h-10 w-auto"
              priority
            />
          ) : (
            <span className="font-serif text-xl font-bold text-maroon">
              {settings?.brand_name || "Buda Ko Achar"}
            </span>
          )}
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

          {/* Cart Icon with Mini-Cart Popover */}
          <Popover open={cartOpen} onOpenChange={setCartOpen}>
            <PopoverTrigger
              nativeButton={false}
              onMouseEnter={openCart}
              onMouseLeave={scheduleClose}
              render={
                <Link
                  href="/cart"
                  className="relative p-2 text-gray-700 hover:text-maroon transition"
                  aria-label="Cart"
                  onClick={(e) => e.preventDefault()}
                />
              }
            >
              <ShoppingBag className="w-6 h-6" />
              {cartCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-gold text-maroon text-[10px] font-bold rounded-full border-0"
                >
                  {cartCount}
                </Badge>
              )}
            </PopoverTrigger>

            {cart && cart.items.length > 0 && (
              <PopoverContent
                align="end"
                sideOffset={8}
                onMouseEnter={openCart}
                onMouseLeave={scheduleClose}
                className="w-80 p-0"
              >
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
              </PopoverContent>
            )}
          </Popover>

          {/* Mobile Menu Sheet */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-gray-700 hover:text-maroon"
                  aria-label="Toggle Menu"
                />
              }
            >
              <Menu className="w-6 h-6" />
            </SheetTrigger>
            <SheetContent side="left" showCloseButton={false}>
              <SheetHeader>
                <SheetTitle className="font-serif text-lg font-bold text-maroon">
                  Menu
                </SheetTitle>
              </SheetHeader>
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
