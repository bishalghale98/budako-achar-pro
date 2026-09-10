import React from "react";
import Link from "next/link";


export default function CheckoutPage() {
    return (
        <>


            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="font-serif text-3xl font-bold text-darkText mb-8">
                    Checkout
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Customer Form */}
                    <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
                        <h2 className="font-serif text-xl font-bold text-darkText">
                            Customer & Delivery Information
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Your full name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-maroon"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                                    Phone Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="98XXXXXXXX"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-maroon"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-maroon"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                                Street Address
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Sangeet Chowk"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-maroon"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                                    City
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Itahari"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                                    Province
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Koshi Province"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
                                Delivery Notes (Optional)
                            </label>
                            <textarea
                                rows={2}
                                placeholder="Special instructions for delivery"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-maroon"
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <h3 className="font-bold text-darkText mb-3 text-sm uppercase tracking-wide">
                                Payment Method
                            </h3>
                            <div className="space-y-2 text-sm">
                                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        defaultChecked
                                        className="text-maroon focus:ring-maroon"
                                    />
                                    <span>Cash on Delivery (COD)</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        className="text-maroon focus:ring-maroon"
                                    />
                                    <span>eSewa / Khalti / QR Payment</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <input
                                        type="radio"
                                        name="payment"
                                        className="text-maroon focus:ring-maroon"
                                    />
                                    <span>Bank Transfer</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary sidebar */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit space-y-4">
                        <h3 className="font-serif font-bold text-lg text-darkText">
                            Order Summary
                        </h3>
                        <div className="space-y-3 text-sm text-gray-600 pt-2 border-t border-gray-100">
                            <div className="flex justify-between">
                                <span>Chicken Achar (x1)</span>
                                <span>NPR 350</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Buff Achar (x1)</span>
                                <span>NPR 400</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Delivery</span>
                                <span>NPR 100</span>
                            </div>
                            <div className="flex justify-between font-bold text-darkText text-base pt-2 border-t border-gray-100">
                                <span>Total</span>
                                <span className="text-maroon">NPR 850</span>
                            </div>
                        </div>
                        <Link
                            href="/order-success"
                            className="block w-full py-3.5 bg-maroon text-white font-medium text-center rounded-lg hover:bg-maroon-hover transition shadow-sm"
                        >
                            Place Order
                        </Link>
                    </div>
                </div>
            </main>


        </>
    );
}