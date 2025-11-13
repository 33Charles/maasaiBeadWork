// client/src/pages/ShopPage.tsx
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import axios from "axios";
import { useToast } from "@/lib/use-toast";

// Product interface
interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  images: string[];
}

// Mock fallback data
const mockProducts: Product[] = [
  { id: 1, title: "Red Warrior Necklace", price: 45, category: "necklace", images: ["/bead1.jpg"] },
  { id: 2, title: "Blue Sky Earrings", price: 28, category: "earrings", images: ["/bead2.jpg"] },
  { id: 3, title: "Green Earth Bracelet", price: 35, category: "bracelet", images: ["/bead3.jpg"] },
  { id: 4, title: "Golden Sunset Anklet", price: 52, category: "anklet", images: ["/bead4.jpg"] },
  { id: 5, title: "Tribal Belt", price: 78, category: "belt", images: ["/bead5.jpg"] },
  { id: 6, title: "Royal Crown Headpiece", price: 120, category: "other", images: ["/bead6.jpg"] },
];

export default function ShopPage() {
  const { toast } = useToast(); // Fixed: correct destructuring
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 200]);

  const categories = ["all", "necklace", "earrings", "bracelet", "anklet", "belt", "other"];

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/products");
        let data: Product[] = [];
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (res.data?.products) {
          data = res.data.products;
        } else if (res.data?.data) {
          data = res.data.data;
        } else {
          console.warn("Unexpected API response shape:", res.data);
          data = [];
        }
        setProducts(data);
      } catch (error: any) {
        console.error("Failed to fetch products:", error);
        toast.error("Failed to load products. Showing demo data.");
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [toast]);

  // Filter logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "all" || p.category === category;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, search, category, priceRange]);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">

        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Shop Beadwork</h1>
          <p className="text-muted-foreground">Discover authentic Maasai craftsmanship</p>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 px-4 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>

          {/* Price Range */}
          <div className="flex items-center gap-4">
            <Label className="whitespace-nowrap">
              Price: ${priceRange[0]} - ${priceRange[1]}
            </Label>
            <input
              type="range"
              min="0"
              max="200"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-32 accent-primary"
            />
          </div>

          {/* Clear Filters */}
          {(search || category !== "all" || priceRange[1] < 200) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setPriceRange([0, 200]);
              }}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-6">
          {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
        </p>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted/50" />
                  <div className="p-4 space-y-2">
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
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearch("");
                setCategory("all");
                setPriceRange([0, 200]);
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="group overflow-hidden border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
              >
                <CardContent className="p-0">
                  <div className="aspect-square relative overflow-hidden bg-muted/50">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="h-full w-full bg-linear-to-br from-maasai-red/10 to-maasai-blue/10" />
                    <Badge className="absolute top-3 right-3 z-10" variant="secondary">
                      ${product.price}
                    </Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {product.title}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize mt-1">
                      {product.category}
                    </p>
                    <Button className="w-full mt-4" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}