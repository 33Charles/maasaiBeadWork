import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { ArrowRight, Users, Package, Sparkles, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden py-20 md:py-32">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('/hero-beadwork.jpg')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-sm" />

        <div className="relative z-20 container mx-auto px-4 text-center">
          <Badge
            variant="outline"
            className="mb-4 border-primary text-primary text-md px-3 py-0.5"
          >
            Authentic Maasai Beadwork
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Handcrafted by <span className="text-primary">Maasai Artisans</span>
          </h1>
          <p className="text-lg md:text-xl text-secondary-foreground mb-8 max-w-2xl mx-auto">
            Discover vibrant, culturally rich jewelry and accessories. Each
            piece tells a story of tradition, skill, and community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="group text-md">
              <Link to="/shop">
                Explore Collection
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-sm">
              <Link to="/sell">Sell Your Beadwork</Link>
            </Button>
          </div>
        </div>

        <div className="absolute inset-0 opacity-10 pointer-events-none z-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-maasai-red blur-3xl" />
          <div className="absolute bottom-20 right-20 w-40 h-40 rounded-full bg-maasai-blue blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-maasai-yellow blur-3xl" />
        </div>
      </section>

      <section className="py-16 bg-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary">
                250+
              </div>
              <p className="text-muted-foreground mt-2">Artisans</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary">
                2.5K+
              </div>
              <p className="text-muted-foreground mt-2">Products</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary">
                47
              </div>
              <p className="text-muted-foreground mt-2">Regions</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary">
                4.9
              </div>
              <p className="text-muted-foreground mt-2">Rating</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose <span className="text-primary">Maasai Beadwork </span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 bg-card/50 border-border hover:border-primary/50 transition-colors">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Support Artisans</h3>
              <p className="text-muted-foreground">
                Every purchase directly empowers Maasai women and preserves
                cultural heritage.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 border-border hover:border-primary/50 transition-colors">
              <Package className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Authentic Craftsmanship
              </h3>
              <p className="text-muted-foreground">
                Handmade with traditional techniques passed down through
                generations.
              </p>
            </Card>

            <Card className="p-6 bg-card/50 border-border hover:border-primary/50 transition-colors">
              <Sparkles className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Unique & Vibrant</h3>
              <p className="text-muted-foreground">
                Bold colors and patterns — no two pieces are exactly alike.
              </p>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-20 bg-primary/10">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Own a Piece of Culture?
          </h2>
          <Button asChild size="lg" className="group">
            <Link to="/shop">
              Start Shopping
              <Heart className="ml-2 h-5 w-5 transition-transform group-hover:scale-110" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
