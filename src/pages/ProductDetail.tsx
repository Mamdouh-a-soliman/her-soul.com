import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingBag, Heart } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/lib/supabase";
import { useCart } from "@/contexts/CartContext";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discount_price?: number;
  description: string;
  main_image: string;
  images: string[];
}
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

const ProductDetail = () => {
  const { id } = useParams();
  const isMobile = useIsMobile();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const fetchProduct = async (productId: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    if (error) {
      console.error("Error fetching product:", error);
      setProduct(null);
    } else {
      setProduct(data);
      if (data) {
        fetchRelatedProducts(data.category, productId);
      }
    }
    setLoading(false);
  };

  const fetchRelatedProducts = async (category: string, currentId: string) => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("category", category)
      .neq("id", currentId)
      .limit(4);

    if (error) {
      console.error("Error fetching related products:", error);
    } else {
      setRelatedProducts(data || []);
    }
  };

  useEffect(() => {
    if (!carouselApi) return;

    carouselApi.on('select', () => {
      setSelectedImage(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/shop">
            <Button>Return to Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  const productImages = product.images.length > 0 ? product.images : [product.main_image];

  const handleAddToCart = () => {
    const displayPrice = product.discount_price || product.price;
    addToCart({
      id: product.id,
      name: product.name,
      price: Number(displayPrice),
      image: product.main_image,
    });
    toast.success("Added to cart!", {
      description: `${product.name} has been added to your cart.`
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/shop">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Button>
        </Link>

        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Product Images */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Thumbnails - Left side on desktop, horizontal scroll on mobile */}
            {productImages.length > 1 && (
              <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible order-2 md:order-1">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index);
                      if (isMobile && carouselApi) {
                        carouselApi.scrollTo(index);
                      }
                    }}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-24 overflow-hidden rounded-lg bg-muted transition-all duration-300 ${
                      selectedImage === index 
                        ? "ring-2 ring-primary scale-105 shadow-[0_0_20px_rgba(var(--primary),0.3)]" 
                        : "opacity-60 hover:opacity-100 hover:scale-110"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - View ${index + 1}`}
                      className="h-full w-full object-contain transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            )}
            
            {/* Main Image - Swipeable on mobile, static on desktop */}
            <div className="flex-1 order-1 md:order-2">
              {isMobile ? (
                <Carousel className="w-full" setApi={setCarouselApi}>
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {productImages.map((image, index) => (
                      <CarouselItem key={index} className="pl-2 md:pl-4">
                        <div className="w-full rounded-lg bg-muted shadow-elegant h-[60vh] flex items-center justify-center overflow-hidden transition-transform duration-300">
                          <img
                            src={image}
                            alt={`${product.name} - View ${index + 1}`}
                            className="max-h-full max-w-full object-contain animate-scale-in"
                            onClick={() => setSelectedImage(index)}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>
              ) : (
                <div className="max-w-md w-full mx-auto rounded-lg bg-muted shadow-elegant h-auto aspect-[3/4] flex items-center justify-center overflow-hidden group cursor-zoom-in">
                  <img
                    src={productImages[selectedImage]}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <div className="mb-6">
              {product.discount_price ? (
                <div className="flex items-center gap-3">
                  <p className="text-2xl text-muted-foreground line-through">
                    {product.price} SAR
                  </p>
                  <p className="text-3xl font-bold text-primary">
                    {product.discount_price} SAR
                  </p>
                </div>
              ) : (
                <p className="text-3xl font-bold text-primary">
                  {product.price} SAR
                </p>
              )}
            </div>
            <p className="text-lg text-muted-foreground mb-8">{product.description}</p>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full shadow-elegant"
                onClick={handleAddToCart}
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline" className="w-full">
                <Heart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>
            </div>

            {/* Product Details */}
            <div className="mt-12 space-y-4">
              <h3 className="font-semibold text-lg">Product Details</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Premium quality fabrics</p>
                <p>• Comfortable fit</p>
                <p>• Easy care and maintenance</p>
                <p>• Available in multiple sizes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.id} 
                  product={{
                    id: Number(relatedProduct.id),
                    name: relatedProduct.name,
                    category: relatedProduct.category,
                    price: Number(relatedProduct.price),
                    discount_price: relatedProduct.discount_price ? Number(relatedProduct.discount_price) : undefined,
                    images: relatedProduct.images.length > 0 ? relatedProduct.images : [relatedProduct.main_image],
                    description: relatedProduct.description,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
