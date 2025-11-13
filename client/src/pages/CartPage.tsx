// client/src/pages/ShoppingCartPage.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useToast } from "@/lib/use-toast";
import { Link } from "react-router-dom";

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

// Mock cart (replace with Zustand/Redux later)
const mockCart: CartItem[] = [
  { id: 1, title: "Red Warrior Necklace", price: 45, quantity: 2, image: "/bead1.jpg", category: "necklace" },
  { id: 2, title: "Blue Sky Earrings", price: 28, quantity: 1, image: "/bead2.jpg", category: "earrings" },
  { id: 3, title: "Tribal Belt", price: 78, quantity: 1, image: "/bead5.jpg", category: "belt" },
];

export default function ShoppingCartPage() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>(mockCart);
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    toast.success("Item removed from cart");
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.16; // 16% VAT
  const total = subtotal + tax;

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Your Cart</h1>
          <p className="text-muted-foreground">Review your Maasai treasures</p>
        </div>

        {cart.length === 0 ? (
          /* Empty State */
          <Card className="border-border">
            <CardContent className="flex flex-col items-center py-16 text-center">
              <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Looks like you haven't added any beadwork yet.</p>
              <Button asChild size="lg">
                <Link to="/shop">Continue Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <Card key={item.id} className="overflow-hidden border-border">
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      {/* Image */}
                      <div className="aspect-square w-24 h-24 rounded-lg bg-muted/50 overflow-hidden flex-shrink-0">
                        <div className="h-full w-full bg-linear-to-br from-primary/10 to-primary/5" />
                      </div>

                      {/* Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                        <p className="text-lg font-bold text-primary mt-1">${item.price}</p>
                      </div>

                      {/* Quantity & Remove */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Badge variant="secondary" className="w-10 justify-center">
                          {item.quantity}
                        </Badge>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8"
                          onClick={() => updateQuantity(item.id, 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 border-border">
                <CardContent className="p-6 space-y-6">
                  <h2 className="text-xl font-semibold">Order Summary</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Tax (16%)</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Button size="lg" className="w-full" asChild>
                    <Link to="/checkout">Proceed to Checkout</Link>
                  </Button>

                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/shop">Continue Shopping</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}