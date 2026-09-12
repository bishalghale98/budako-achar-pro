"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
      <RadioGroup value={selected} onValueChange={onChange} className="space-y-2">
        {methods.map((method) => (
          <Label
            key={method.id}
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
              selected === method.id
                ? "border-maroon bg-maroon/5"
                : "border-border hover:bg-muted"
            }`}
          >
            <RadioGroupItem value={method.id} />
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
      </RadioGroup>
      {error && (
        <p className="text-xs text-destructive mt-1">{error}</p>
      )}
    </div>
  );
}
