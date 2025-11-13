// client/src/pages/CheckoutSuccess.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Package } from "lucide-react";
import { Link } from "react-router-dom";

export default function CheckoutSuccess() {
  return (
    <div className="min-h-screen bg-background py-16 flex items-center justify-center">
      <Card className="max-w-md w-full border-border">
        <CardContent className="p-8 text-center space-y-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
          <h1 className="text-3xl font-bold">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your purchase. Your Maasai beadwork is being prepared with care.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm">
            <Package className="h-4 w-4" />
            <span>Estimated delivery: 5-7 business days</span>
          </div>
          <Button asChild size="lg" className="w-full">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}