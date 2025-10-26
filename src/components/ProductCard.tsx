import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
  isRamadan?: boolean;
}

export const ProductCard = ({ product, isRamadan = false }: ProductCardProps) => {
  return (
    <Link to={`/product/${product.id}`}>
      <Card className={`group overflow-hidden transition-all duration-300 hover:-translate-y-1 ${
        isRamadan 
          ? 'border-4 border-double border-amber-600/40 bg-gradient-to-br from-emerald-950/5 to-amber-950/5 hover:shadow-[0_0_30px_rgba(217,119,6,0.3)]' 
          : 'border-border hover:shadow-elegant'
      }`}>
        <div className={`aspect-[3/4] overflow-hidden ${isRamadan ? 'bg-gradient-to-br from-emerald-950/10 to-amber-950/10' : 'bg-muted'} ${isRamadan ? 'p-3' : ''}`}>
          <div className={`h-full w-full ${isRamadan ? 'border-2 border-amber-600/30 rounded-sm relative' : ''}`}>
            {isRamadan && (
              <>
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-600"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-600"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-600"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-600"></div>
              </>
            )}
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.category}</p>
          <h3 className="font-semibold text-base mb-2 line-clamp-1">{product.name}</h3>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <p className="text-lg font-bold text-primary">£{product.price}</p>
        </CardFooter>
      </Card>
    </Link>
  );
};
