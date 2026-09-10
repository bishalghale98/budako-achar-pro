"use client";

import type { PaymentMethod } from "@/data/checkout";

interface CustomerFormProps {
  defaultCity: string;
  defaultProvince: string;
  paymentMethods: PaymentMethod[];
}

export function CustomerForm({
  defaultCity,
  defaultProvince,
  paymentMethods,
}: CustomerFormProps) {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
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
            defaultValue={defaultCity}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            Province
          </label>
          <input
            type="text"
            defaultValue={defaultProvince}
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
          {paymentMethods.map((method) => (
            <label
              key={method.id}
              className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <input
                type="radio"
                name="payment"
                defaultChecked={method.id === "cod"}
                className="text-maroon focus:ring-maroon"
              />
              <span>{method.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
