import { useState, useEffect } from "react";
import { ProductCard } from "@/components/ProductCard";
import { categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

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

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("Error fetching products:", error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const filteredProducts = selectedCategory === "All"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  const isRamadanTheme = selectedCategory === "Kaftans";

  return (
    <div className={`min-h-screen py-12 ${isRamadanTheme ? 'bg-gradient-to-br from-purple-900/10 via-background to-amber-900/10' : ''}`}>
      <div className="container mx-auto px-4">
        {/* Ramadan Decorative Elements */}
        {isRamadanTheme && (
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-20 right-10 text-6xl">🌙</div>
            <div className="absolute top-40 left-10 text-4xl">⭐</div>
            <div className="absolute bottom-40 right-20 text-5xl">✨</div>
            <div className="absolute bottom-20 left-20 text-4xl">🌙</div>
          </div>
        )}
        {/* Header */}
        <div className="text-center mb-12 relative z-10">
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${isRamadanTheme ? 'text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-amber-600' : ''}`}>
            {isRamadanTheme ? 'Ramadan Collection' : 'Shop Collection'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {isRamadanTheme ? 'Elegant kaftans for blessed Ramadan celebrations' : 'Explore our curated selection of modern casual wear'}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12 relative z-10">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className="transition-smooth"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Loading products...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
              {filteredProducts.map((product) => (
                <ProductCard 
                  key={product.id} 
                  product={{
                    id: product.id,
                    name: product.name,
                    category: product.category,
                    price: Number(product.price),
                    discount_price: product.discount_price ? Number(product.discount_price) : undefined,
                    images: product.images.length > 0 ? product.images : [product.main_image],
                    description: product.description,
                  }} 
                  isRamadan={isRamadanTheme}
                />
              ))}
            </div>

            {/* No Results */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-lg text-muted-foreground">
                  No products found in this category
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Shop;
