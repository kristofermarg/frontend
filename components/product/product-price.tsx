import type { Product } from "@/types/woocommerce";
import { formatCurrency } from "@/lib/price";

type Props = {
  product: Product;
  className?: string;
};

export default function ProductPrice({ product, className }: Props) {
  const regularPrice = product.regular_price || product.price;
  const salePrice = product.sale_price && product.sale_price !== "0";

  return (
    <div className={`flex items-end gap-2 ${className ?? ""}`}>
      <span className="text-lg font-semibold text-white">
        {formatCurrency(salePrice ? product.sale_price : regularPrice)}
      </span>
      {salePrice ? (
        <span className="text-sm text-white/50 line-through">
          {formatCurrency(regularPrice)}
        </span>
      ) : null}
    </div>
  );
}
