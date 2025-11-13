import { useState } from "react";
import axiosInstance from "@/apis/axios";
import axios from "axios";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useToast } from "@/lib/use-toast";
import { LogIn, Mail, Lock, Sparkles, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export default function LoginPage() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [isSending, setIsSending] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["login-user"],
    mutationFn: async (userData: { email: string; password: string }) => {
      const response = await axiosInstance.post("/api/auth/login", userData);
      return response.data;
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Login failed.");
      } else {
        toast.error("Something went wrong.");
      }
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data.userInfo));
      toast.success("Authenticated successfully.");
      navigate("/shop");
    },
  });

  const handleLogin = () => {
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const newErrors: Record<string, string> = {};
      if (fieldErrors.email?.[0]) newErrors.email = fieldErrors.email[0];
      if (fieldErrors.password?.[0]) newErrors.password = fieldErrors.password[0];
      setErrors(newErrors);
      return;
    }

    setErrors({});
    mutate(result.data);
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = forgotSchema.safeParse({ email: forgotEmail });
    if (!result.success) {
      toast.error("Enter a valid email.");
      return;
    }

    try {
      setIsSending(true);
      await axiosInstance.post("/api/auth/forgot-password", {
        email: forgotEmail,
      });
      setForgotSuccess("Password reset instructions have been sent to your email.");
      setForgotEmail("");
      setTimeout(() => setShowForgot(false), 4000);
    } catch {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-primary/10 via-background to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-primary/5 bg-size-[50px_50px]" />

      <Card className="w-full max-w-md mx-auto border-border shadow-lg relative z-10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold bg-linear-to-r from-primary to-yellow-600 bg-clip-text text-transparent">
            Welcome Back
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Log in to your Maasai Beadwork Marketplace account
          </p>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-9"
                  value={email}
                  onChange={(e) => {
                    setErrors((prev) => ({ ...prev, email: "" }));
                    setEmail(e.target.value);
                  }}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  value={password}
                  onChange={(e) => {
                    setErrors((prev) => ({ ...prev, password: "" }));
                    setPassword(e.target.value);
                  }}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <Button
              type="button"
              size="lg"
              className="w-full group"
              disabled={isPending}
              onClick={handleLogin}
            >
              <LogIn className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform" />
              {isPending ? "Logging in..." : "Log In"}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="text-center flex flex-col space-y-2">
          <button
            onClick={() => {
              setShowForgot(true);
              setForgotSuccess("");
            }}
            className="text-sm text-primary hover:underline"
          >
            Forgot your password?
          </button>

          <p className="text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>

        {showForgot && (
          <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="relative w-full px-6">
              <button
                onClick={() => setShowForgot(false)}
                className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5 text-destructive" />
              </button>

              <form
                onSubmit={handleForgotSubmit}
                className="space-y-4 bg-card p-6 rounded-xl border shadow-md"
              >
                <h2 className="text-lg font-semibold text-center">Reset Password</h2>

                {forgotSuccess && (
                  <p className="text-sm text-green-600 text-center bg-green-50 border border-green-200 rounded-md p-2">
                    {forgotSuccess}
                  </p>
                )}

                <div className="space-y-2">
                  <Label htmlFor="forgotEmail">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="forgotEmail"
                      type="email"
                      placeholder="you@example.com"
                      className="pl-9"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isSending}>
                  {isSending ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
