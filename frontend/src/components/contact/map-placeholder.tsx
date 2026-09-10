interface MapPlaceholderProps {
  text: string;
}

export function MapPlaceholder({ text }: MapPlaceholderProps) {
  return (
    <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center border border-gray-300">
      <p className="text-gray-500 font-medium text-sm">{text}</p>
    </div>
  );
}
