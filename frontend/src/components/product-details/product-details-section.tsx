interface ProductDetailsSectionProps {
  ingredients: string;
  storageInfo: string;
}

export function ProductDetailsSection({
  ingredients,
  storageInfo,
}: ProductDetailsSectionProps) {
  return (
    <div className="space-y-4 pt-6 border-t border-border text-sm text-muted-foreground">
      <div>
        <h4 className="font-bold text-foreground mb-1">Ingredients</h4>
        <p>{ingredients}</p>
      </div>
      <div>
        <h4 className="font-bold text-foreground mb-1">Storage Information</h4>
        <p>{storageInfo}</p>
      </div>
    </div>
  );
}
