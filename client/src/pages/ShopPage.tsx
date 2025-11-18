// client/src/pages/ShopPage.tsx
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X, Loader2 } from "lucide-react";
import axiosInstance from "@/apis/axios";
import { useToast } from "@/lib/use-toast";
import ViewProductDetails from "@/components/ViewProductDetails";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface ProductImage {
  url: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  images: ProductImage[];
}

export default function ShopPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const categories = [
    "all",
    "necklace",
    "earrings",
    "bracelet",
    "anklet",
    "belt",
    "other",
  ];

  // Shared mutation for adding to cart (used in both grid & modal)
  const addToCartMutation = useMutation({
    mutationFn: async (productId: number) => {
      const res = await axiosInstance.post("/api/cart/add", {
        productId,
        quantity: 1,
      });
      return res.data;
    },
    onSuccess: (_, productId) => {
      // Refresh cart count/badge if you have one
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      const product = products.find(p => p.id === productId);
      toast.success(`${product?.title} was added successfully.`);
    },
    onError: (_error: any) => {
      toast.error("Failed to add item to cart",);
    },
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get("/api/products");
        let data: Product[] = [];
        if (Array.isArray(res.data)) data = res.data;
        else if (res.data?.products) data = res.data.products;
        else if (res.data?.data) data = res.data.data;
        else data = [];

        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const isSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const isCategory = category === "all" || p.category === category;
      const isPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return isSearch && isCategory && isPrice;
    });
  }, [products, search, category, priceRange]);

  const handleAddToCart = (productId: number) => {
    addToCartMutation.mutate(productId);
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Shop Beadwork</h1>
          <p className="text-muted-foreground">
            Discover authentic Maasai craftsmanship
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 px-4 rounded-md border border-input bg-background text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          <div className="flex items-center gap-4">
            <Label className="whitespace-nowrap">
              Price: ${priceRange[0]} - ${priceRange[1]}
            </Label>
            <input
              type="range"
              min="0"
              max="500"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-32 accent-primary"
            />
          </div>

          {(search || category !== "all" || priceRange[1] < 500) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setPriceRange([0, 500]);
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
        </p>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted/50" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-muted rounded w-3/4" />
                    <div className="h-4 bg-muted rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">No products found.</p>
            <Button variant="outline" className="mt-4" onClick={() => {
              setSearch("");
              setCategory("all");
              setPriceRange([0, 500]);
            }}>
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border-border hover:border-primary/50 
                          transition-all duration-300 hover:shadow-xl rounded-lg"
              >
                <CardContent className="p-0 flex flex-col h-full">
                  <div className="relative w-full h-50 overflow-hidden bg-muted">
                    <img
                      src={`http://127.0.0.1:3000${product.images[0]}`}
                      alt={product.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <Badge className="absolute top-3 right-3 bg-chart-1 text-black text-sm" variant="secondary">
                      ${product.price}
                    </Badge>
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-xs text-muted-foreground capitalize mt-1">
                      {product.category}
                    </p>

                    <div className="mt-auto pt-4 flex flex-col gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full hover:cursor-pointer"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowDetails(true);
                        }}
                      >
                        View Details
                      </Button>

                      <Button
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700 hover:cursor-pointer text-white"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addToCartMutation.isPending}
                      >
                        {addToCartMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add to Cart"
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <ViewProductDetails
        open={showDetails}
        onClose={() => setShowDetails(false)}
        product={selectedProduct}
      />
    </div>
  );
}