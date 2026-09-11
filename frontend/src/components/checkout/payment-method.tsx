"use client";

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
          <label
            key={method.id}
            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
              selected === method.id
                ? "border-maroon bg-maroon/5"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              name="payment_method"
              value={method.id}
              checked={selected === method.id}
              onChange={() => onChange(method.id)}
              className="text-maroon focus:ring-maroon"
            />
            <div>
              <span className="font-medium">{method.label}</span>
              {method.description && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {method.description}
                </p>
              )}
            </div>
          </label>
        ))}
      </div>
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
