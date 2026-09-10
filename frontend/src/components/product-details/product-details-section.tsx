interface ProductDetailsSectionProps {
  ingredients: string;
  storageInfo: string;
}

export function ProductDetailsSection({
  ingredients,
  storageInfo,
}: ProductDetailsSectionProps) {
  return (
    <div className="space-y-4 pt-6 border-t border-gray-200 text-sm text-gray-600">
      <div>
        <h4 className="font-bold text-darkText mb-1">Ingredients</h4>
        <p>{ingredients}</p>
      </div>
      <div>
        <h4 className="font-bold text-darkText mb-1">Storage Information</h4>
        <p>{storageInfo}</p>
      </div>
    </div>
  );
}
