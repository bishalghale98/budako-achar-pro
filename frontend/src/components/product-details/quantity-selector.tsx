"use client";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface QuantitySelectorProps {
  value: number;
  onChange: (value: number) => void;
}

export function QuantitySelector({ value, onChange }: QuantitySelectorProps) {
  return (
    <div>
      <Label className="block text-xs font-bold uppercase text-muted-foreground mb-2">
        Quantity
      </Label>
      <div className="inline-flex items-center border border-border rounded-lg bg-card">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="px-3 py-1 text-muted-foreground hover:bg-muted transition h-8 w-8"
        >
          -
        </Button>
        <span className="px-4 py-1 text-sm font-semibold">{value}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange(value + 1)}
          className="px-3 py-1 text-muted-foreground hover:bg-muted transition h-8 w-8"
        >
          +
        </Button>
      </div>
    </div>
  );
}
