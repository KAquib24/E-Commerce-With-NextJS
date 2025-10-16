"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, MapPin, Phone, Navigation } from "lucide-react";

export interface CheckoutFormData {
  name: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  phone: string;
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
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-0 space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 text-gray-700 block">
                Full Name *
              </label>
              <Input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-gray-700" />
                <label className="text-sm font-medium text-gray-700">
                  Email Address *
                </label>
              </div>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="john@example.com"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4 text-gray-700" />
              <label className="text-sm font-medium text-gray-700">
                Phone Number
              </label>
            </div>
            <Input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
        </div>

        {/* Shipping Address */}
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Shipping Address</h3>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 text-gray-700 block">
              Street Address *
            </label>
            <Input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              required
              placeholder="123 Main Street, Apt 4B"
              className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="h-4 w-4 text-gray-700" />
                <label className="text-sm font-medium text-gray-700">
                  City *
                </label>
              </div>
              <Input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                placeholder="New York"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 text-gray-700 block">
                ZIP / Postal Code *
              </label>
              <Input
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                required
                placeholder="10001"
                className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Required Fields Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <span className="font-medium">Note:</span> Fields marked with * are required to complete your order.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}