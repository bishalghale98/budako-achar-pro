"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <h3 className="font-serif font-bold text-xl text-darkText">
        Send Us a Message
      </h3>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="contact-name" className="text-xs font-bold uppercase text-gray-500">
            Your Name
          </Label>
          <Input
            id="contact-name"
            type="text"
            placeholder="Full name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-phone" className="text-xs font-bold uppercase text-gray-500">
            Phone Number
          </Label>
          <Input
            id="contact-phone"
            type="text"
            placeholder="98XXXXXXXX"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="contact-message" className="text-xs font-bold uppercase text-gray-500">
            Message
          </Label>
          <Textarea
            id="contact-message"
            rows={4}
            placeholder="How can we help you?"
          />
        </div>
        <button className="w-full py-3 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition text-sm">
          Send Message
        </button>
      </div>
    </div>
  );
}
