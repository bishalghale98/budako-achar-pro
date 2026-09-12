"use client";

import { useState } from "react";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function QuantitySelector({ value, onChange }: QuantitySelectorProps) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase text-muted-foreground mb-2">
        Quantity
      </label>
      <div className="inline-flex items-center border border-border rounded-lg bg-card">
        <button
          onClick={() => onChange(Math.max(1, value - 1))}
          className="px-3 py-1 text-muted-foreground hover:bg-muted transition"
        >
          -
        </button>
        <span className="px-4 py-1 text-sm font-semibold">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="px-3 py-1 text-muted-foreground hover:bg-muted transition"
        >
          +
        </button>
      </div>
    </div>
  );
}
