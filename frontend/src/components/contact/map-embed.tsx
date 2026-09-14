interface MapPlaceholderProps {
  text: string;
  embedUrl?: string | null;
}

export function MapPlaceholder({ text, embedUrl }: MapPlaceholderProps) {
  if (embedUrl) {
    return (
      <iframe
        src={embedUrl}
        className="w-full h-64 rounded-xl border border-gray-300"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Store Location"
      />
    );
  }

  return (
    <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center border border-gray-300">
      <p className="text-gray-500 font-medium text-sm">{text}</p>
    </div>
  );
}
