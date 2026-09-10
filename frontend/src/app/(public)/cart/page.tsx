import React from "react";
import Link from "next/link";
import Image from "next/image";


export default function CartPage() {
    return (
        <>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="font-serif text-3xl font-bold text-darkText mb-8">
                    Your Achar Basket
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Item 1: Chicken Achar */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                    <Image
                                        src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=200"
                                        alt="Chicken Achar"
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-base text-darkText">
                                        Chicken Achar
                                    </h3>
                                    <p className="text-xs text-gray-500">Variant: 500g Jar</p>
                                    <p className="text-maroon font-bold text-sm mt-1">NPR 350</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-sm font-semibold">Qty: 1</span>
                                <button className="text-red-500 hover:text-red-700 text-sm font-medium transition">
                                    Remove
                                </button>
                            </div>
                        </div>

                        {/* Item 2: Buff Achar */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                                    <Image
                                        src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&q=80&w=200"
                                        alt="Buff Achar"
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                    />
                                </div>
                                <div>
                                    <h3 className="font-serif font-bold text-base text-darkText">
                                        Buff Achar
                                    </h3>
                                    <p className="text-xs text-gray-500">Variant: 500g Jar</p>
                                    <p className="text-maroon font-bold text-sm mt-1">NPR 400</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-sm font-semibold">Qty: 1</span>
                                <button className="text-red-500 hover:text-red-700 text-sm font-medium transition">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit space-y-4">
                        <h3 className="font-serif font-bold text-lg text-darkText">Order Summary</h3>
                        <div className="space-y-2 text-sm text-gray-600 pt-2 border-t border-gray-100">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>NPR 750</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery</span>
                                <span>Calculated at Checkout</span>
                            </div>
                            <div className="flex justify-between font-bold text-darkText text-base pt-2 border-t border-gray-100">
                                <span>Total</span>
                                <span className="text-maroon">NPR 750</span>
                            </div>
                        </div>
                        <Link
                            href="/checkout"
                            className="block w-full py-3.5 bg-maroon text-white font-medium text-center rounded-lg hover:bg-maroon-hover transition shadow-sm"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </main>


        </>
    );
}