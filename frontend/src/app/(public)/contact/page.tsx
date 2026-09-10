import React from "react";


export default function ContactPage() {
  return (
    <>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-16 ">
          <span className="text-maroon font-semibold text-sm tracking-wider uppercase">
            Get in Touch
          </span>
          <h1 className="font-serif text-4xl font-bold text-darkText">
            Contact Buda Ko Achar
          </h1>
          <p className="text-gray-600">
            Have questions or want to place an order? Reach out to us directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info & quick CTAs */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-serif font-bold text-xl text-darkText">
                Store Information
              </h3>
              <div className="space-y-4 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="text-maroon font-bold">Location:</span>
                  <span>Sangeet Chowk, Itahari, Koshi Province, Nepal</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-maroon font-bold">Phone:</span>
                  <a href="tel:9827078809" className="hover:underline font-semibold">
                    982-7078809
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-maroon font-bold">WhatsApp:</span>
                  <a
                    href="https://wa.me/9827078809"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline font-semibold"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center border border-gray-300">
              <p className="text-gray-500 font-medium text-sm">
                Sangeet Chowk, Itahari Map Location Placeholder
              </p>
            </div>
          </div>

          {/* Contact Form */}
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
        </div>
      </main>


    </>
  );
}