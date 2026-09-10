import type { ContactInfo } from "@/data/contact";

interface StoreInfoCardProps {
  info: ContactInfo;
}

export function StoreInfoCard({ info }: StoreInfoCardProps) {
  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
      <h3 className="font-serif font-bold text-xl text-darkText">
        Store Information
      </h3>
      <div className="space-y-4 text-sm text-gray-700">
        <div className="flex items-start gap-3">
          <span className="text-maroon font-bold">Location:</span>
          <span>{info.location}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-maroon font-bold">Phone:</span>
          <a href={`tel:${info.phone.replace("-", "")}`} className="hover:underline font-semibold">
            {info.phone}
          </a>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-maroon font-bold">WhatsApp:</span>
          <a
            href={`https://wa.me/${info.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline font-semibold"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
