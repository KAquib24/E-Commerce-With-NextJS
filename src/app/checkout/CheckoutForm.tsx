// src/app/checkout/CheckoutForm.tsx
"use client";

import { Input } from "@/components/ui/input";

export interface CheckoutFormData {
  name: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
}

interface CheckoutFormProps {
  form: CheckoutFormData;
  setForm: React.Dispatch<React.SetStateAction<CheckoutFormData>>;
}

export default function CheckoutForm({ form, setForm }: CheckoutFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <Input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="John Doe"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="john@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Address</label>
        <Input
          type="text"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          placeholder="123 Main Street"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <Input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            placeholder="New York"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Pincode</label>
          <Input
            type="text"
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            required
            placeholder="10001"
          />
        </div>
      </div>
    </div>
  );
}