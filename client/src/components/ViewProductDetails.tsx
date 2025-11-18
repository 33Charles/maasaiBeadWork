// client/src/components/ViewProductDetails.tsx
import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/lib/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/apis/axios";

interface Product {
  id: string | number;
  title: string;
  price: number;
  category: string;
  images: string[];           // e.g. ["/uploads/img1.jpg", ...]
  description?: string;
}

interface ViewProductDetailsProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
}

export default function ViewProductDetails({
  open,
  onClose,
  product,
}: ViewProductDetailsProps) {
  // Hooks at the top — never conditional!
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeImage, setActiveImage] = useState(0);

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (productId: string | number) => {
      const res = await axiosInstance.post("/api/cart/add", {
        productId,
        quantity: 1,
      });
      return res.data;
    },
    onSuccess: () => {
      // Optionally invalidate cart query to refresh count/badge
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      toast.success(`${product?.title} was added successfully.`);
    },
    onError: (_error) => {
      toast.error("Failed to add item to cart",);
    },
  });

  // Safe early return AFTER hooks
  if (!open || !product) return null;

  const baseURL = "http://127.0.0.1:3000";

  const handleAddToCart = () => {
    addToCartMutation.mutate(product.id);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-background rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10 bg-background/80 rounded-full p-1"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>

        {/* Main Image */}
        <div className="relative">
          <img
            src={`${baseURL}${product.images[activeImage]}`}
            alt={product.title}
            className="w-full h-80 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Image Thumbnails */}
        {product.images.length > 1 && (
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all
                  ${activeImage === index 
                    ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background" 
                    : "border-border opacity-70 hover:opacity-100"
                  }`}
              >
                <img
                  src={`${baseURL}${img}`}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Product Info */}
        <div className="mt-6 space-y-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{product.title}</h2>
            <p className="text-sm text-muted-foreground capitalize mt-1">
              {product.category}
            </p>
          </div>

          <p className="text-3xl font-bold text-primary">${product.price}</p>

          {product.description && (
            <p className="text-muted-foreground leading-relaxed text-sm">
              {product.description}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4 justify-end">
          <Button variant="outline" size="lg" onClick={onClose}>
            Close
          </Button>

          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-8"
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
          >
            {addToCartMutation.isPending ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Adding...
              </>
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}