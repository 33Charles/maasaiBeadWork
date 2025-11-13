import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Menu, LogIn, UserPlus, LogOut } from "lucide-react";
import { useToast } from "@/lib/use-toast";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {toast} = useToast()

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const cartCount = 1;
  const isLoggedIn = true;
  const userName = "Amina";

  const navItems = [
    { label: "Home", href: "/", highlight: true },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Shop", href: "/shop" },
    { label: "Sell Your Beadwork", href: "/sell" },
    { label: "About", href: "/about" },
  ];

  function handleLogout() {
    localStorage.clear(); 
    toast.success("Logged out successfully.")
    navigate("/login")
  }

  return (
    <header className="sticky top-0 z-50 w-full ">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-maasai-red" />
          <span className="text-xl font-bold text-primary">
            Maasai Beadwork
          </span>
        </Link>

        {/* ── Desktop Nav (Center) ── */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.label}
                to={item.href}
                className={`... ${
                  isActive ? "text-primary" : "text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative transition-all duration-200 hover:scale-110 hover:text-primary"
            onClick={() => {
              if (isLoggedIn) {
                navigate("/cart");
              } else {
                navigate("/login");
              }
            }}
          >
            <ShoppingCart className="h-5 w-5 " />
            {cartCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
              >
                {cartCount}
              </Badge>
            )}
          </Button>

          {!isLoggedIn && (
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="transition-all duration-200 hover:scale-105 hover:text-primary border border-ring"
                onClick={() => navigate("/login")}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="transition-all duration-200 hover:scale-105 hover:text-primary border border-ring"
                onClick={() => navigate("/register")}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Register
              </Button>
            </div>
          )}



          {isLoggedIn && (
            <Avatar className="hidden md:block h-9 w-9 hover:cursor-pointer transition-all duration-200 hover:scale-105" onClick={() => navigate("/profile")}>
              <AvatarImage src="/avatar.jpg" alt={userName} />
              <AvatarFallback className="bg-primary text-black font-semibold text-xl">
                {userName[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}

          {isLoggedIn && (
            <Button
            variant="ghost"
            size="sm"
            className="transition-all duration-200 hover:scale-105 hover:text-destructive border border-ring"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
          )}

          

          {/* Mobile: Menu Button */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="right" className="w-80 bg-card">
              <div className="flex flex-col space-y-6 mt-8">
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-maasai-red" />
                  <span className="text-xl font-bold text-primary">
                    Maasai Beadwork
                  </span>
                </Link>

                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-primary ${
                        item.highlight ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}

                  {/* Mobile: Login + Register */}
                  {!isLoggedIn && (
                    <>
                      <Button
                        className="w-full justify-start"
                        variant="outline"
                        onClick={() => {
                          setOpen(false);
                          navigate("/login");
                        }}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                      </Button>
                      <Button
                        className="w-full justify-start"
                        onClick={() => {
                          setOpen(false);
                          navigate("/register");
                        }}
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Register
                      </Button>
                    </>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
