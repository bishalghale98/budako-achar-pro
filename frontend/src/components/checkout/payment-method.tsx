"use client";

import { Label } from "@/components/ui/label";

interface PaymentMethodOption {
  id: string;
  label: string;
  description?: string;
}

interface PaymentMethodProps {
  methods: PaymentMethodOption[];
  selected: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PaymentMethodRadio({
  methods,
  selected,
  onChange,
  error,
}: PaymentMethodProps) {
  return (
    <div>
      <h3 className="font-bold text-darkText mb-3 text-sm uppercase tracking-wide">
        Payment Method
      </h3>
      <div className="space-y-2 text-sm">
        {methods.map((method) => (
          <Label
            key={method.id}
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
              selected === method.id
                ? "border-maroon bg-maroon/5"
                : "border-border hover:bg-muted"
            }`}
          >
            <input
              type="radio"
              name="payment_method"
              value={method.id}
              checked={selected === method.id}
              onChange={() => onChange(method.id)}
              className="h-4 w-4 shrink-0 border-gray-300 text-maroon focus:ring-maroon"
            />
            <div>
              <span className="font-medium text-darkText">{method.label}</span>
              {method.description && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {method.description}
                </p>
              )}
            </div>
          </Label>
        ))}
      </div>
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}
