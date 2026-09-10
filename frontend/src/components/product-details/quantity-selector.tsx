"use client";

import { useState } from "react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function QuantitySelector({ value, onChange }: QuantitySelectorProps) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
        Quantity
      </label>
      <div className="inline-flex items-center border border-gray-300 rounded-lg bg-white">
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
        >
          -
        </button>
        <span className="px-4 py-1 text-sm font-semibold">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="px-3 py-1 text-gray-600 hover:bg-gray-100 transition"
        >
          +
        </button>
      </div>
    </div>
  );
}
