// client/src/pages/CheckoutPage.tsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/lib/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, CreditCard, Truck, Smartphone, Globe } from "lucide-react";

// Mock cart
const mockCart = [
  { id: 1, title: "Red Warrior Necklace", price: 45, quantity: 2 },
  { id: 2, title: "Blue Sky Earrings", price: 28, quantity: 1 },
];

// Fixed Zod Schema
const checkoutSchema = z.object({
  fullName: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email" }),
  phone: z.string().min(10, { message: "Phone is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  postalCode: z.string().min(4, { message: "Postal code is required" }),
  paymentMethod: z.enum(["card", "mpesa", "paypal"], {
    message: "Please select a payment method", // CORRECT
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: "card",
    },
  });

  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onSubmit = async (data: CheckoutFormData) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const method =
        data.paymentMethod === "card"
          ? "Credit Card"
          : data.paymentMethod === "mpesa"
          ? "M-Pesa"
          : "PayPal";
      toast.success(`Payment via ${method} successful!`);
      navigate("/checkout/success");
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = mockCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 10;
  const tax = subtotal * 0.16;
  const total = subtotal + shipping + tax;

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* ... (same form fields as before) ... */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" {...register("fullName")} />
                      {errors.fullName && (
                        <p className="text-sm text-destructive">{errors.fullName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" {...register("email")} />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" {...register("phone")} />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" {...register("address")} />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" {...register("city")} />
                      {errors.city && (
                        <p className="text-sm text-destructive">{errors.city.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input id="country" {...register("country")} />
                      {errors.country && (
                        <p className="text-sm text-destructive">{errors.country.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input id="postalCode" {...register("postalCode")} />
                      {errors.postalCode && (
                        <p className="text-sm text-destructive">{errors.postalCode.message}</p>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Payment Method */}
                  <div className="space-y-4">
                    <Label>Payment Method</Label>
                    <RadioGroup {...register("paymentMethod")} value={paymentMethod}>
                      <div className="space-y-3">
                        <Label
                          htmlFor="card"
                          className="flex items-center gap-3 p-4 rounded-lg border border-input cursor-pointer hover:border-primary/50 transition-all [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
                        >
                          <RadioGroupItem value="card" id="card" />
                          <CreditCard className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">Credit / Debit Card</p>
                            <p className="text-sm text-muted-foreground">Visa, Mastercard, Amex</p>
                          </div>
                        </Label>

                        <Label
                          htmlFor="mpesa"
                          className="flex items-center gap-3 p-4 rounded-lg border border-input cursor-pointer hover:border-primary/50 transition-all [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
                        >
                          <RadioGroupItem value="mpesa" id="mpesa" />
                          <Smartphone className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">M-Pesa</p>
                            <p className="text-sm text-muted-foreground">Pay via mobile money</p>
                          </div>
                        </Label>

                        <Label
                          htmlFor="paypal"
                          className="flex items-center gap-3 p-4 rounded-lg border border-input cursor-pointer hover:border-primary/50 transition-all [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
                        >
                          <RadioGroupItem value="paypal" id="paypal" />
                          <Globe className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">PayPal</p>
                            <p className="text-sm text-muted-foreground">Secure online payment</p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    {errors.paymentMethod && (
                      <p className="text-sm text-destructive">
                        {errors.paymentMethod.message}
                      </p>
                    )}
                  </div>

                  {/* Conditional Hints */}
                  {paymentMethod === "card" && (
                    <Card className="p-4 bg-muted/50">
                      <p className="text-sm text-muted-foreground">
                        Use test card: <code className="font-mono">4242 4242 4242 4242</code>
                      </p>
                    </Card>
                  )}

                  {paymentMethod === "mpesa" && (
                    <Card className="p-4 bg-muted/50">
                      <p className="text-sm text-muted-foreground">
                        You will receive an M-Pesa prompt on your phone.
                      </p>
                    </Card>
                  )}

                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `Pay $${total.toFixed(2)}`
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 border-border">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {mockCart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (16%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <Link to="/cart">Back to Cart</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}