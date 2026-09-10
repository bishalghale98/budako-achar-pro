"use client";

export function ContactForm() {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <h3 className="font-serif font-bold text-xl text-darkText">
        Send Us a Message
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            Your Name
          </label>
          <input
            type="text"
            placeholder="Full name"
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
        <div>
          <label className="block text-xs font-bold uppercase text-gray-500 mb-1">
            Message
          </label>
          <textarea
            rows={4}
            placeholder="How can we help you?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-maroon"
          />
        </div>
        <button className="w-full py-3 bg-maroon text-white font-medium rounded-lg hover:bg-maroon-hover transition text-sm">
          Send Message
        </button>
      </div>
    </div>
  );
}
