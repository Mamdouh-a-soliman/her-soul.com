import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "./ui/card";

interface MinimalProduct {
  id: string | number;
  name: string;
  category: string;
  price: number;
  discount_price?: number;
  images: string[];
  description: string;
}

interface ProductCardProps {
  product: MinimalProduct;
  isRamadan?: boolean;
}

export const ProductCard = ({ product, isRamadan = false }: ProductCardProps) => {
  const displayPrice = product.discount_price || product.price;
  const hasDiscount = !!product.discount_price;

  return (
    <Link to={`/product/${String(product.id)}`}>
      <Card className={`group overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        isRamadan 
          ? 'border-4 border-double border-amber-600/40 bg-gradient-to-br from-emerald-950/5 to-amber-950/5 hover:shadow-[0_0_30px_rgba(217,119,6,0.3)]' 
          : 'border-border hover:shadow-elegant'
      }`}>
        <div className={`aspect-[3/4] overflow-hidden relative ${
          isRamadan ? 'bg-gradient-to-br from-emerald-950/10 to-amber-950/10 p-3' : 'bg-muted'
        }`}>
          {isRamadan && (
            <div className="absolute inset-0 border-2 border-amber-600/30 rounded-sm pointer-events-none">
              <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-amber-600"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-amber-600"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-amber-600"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-amber-600"></div>
            </div>
          )}
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
              e.currentTarget.onerror = null;
            }}
            className={`h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ${
              isRamadan ? 'rounded-sm' : ''
            }`}
          />
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          <h3 className="font-semibold text-base mb-2 line-clamp-1">{product.name}</h3>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground line-through">{product.price} LE</p>
              <p className="text-lg font-bold text-primary">{displayPrice} LE</p>
            </div>
          ) : (
            <p className="text-lg font-bold text-primary">{product.price} LE</p>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
};