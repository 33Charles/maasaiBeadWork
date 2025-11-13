import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-linear-to-b from-background via-background/80 to-background border-t border-border mt-12">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
        {/* Brand + Description */}
        <div className="space-y-3">
          <h2 className="text-xl font-bold bg-linear-to-r from-primary to-yellow-600 bg-clip-text text-transparent">
            Maasai Beadwork Marketplace
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A digital bridge connecting Maasai artisans to the world.
            Handcrafted designs, woven with heritage and creativity.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Quick Links</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li>
              <Link to="/" className="hover:text-primary transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-primary transition-colors">
                Shop
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                className="hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-primary transition-colors"
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Stay Connected */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Stay Connected</h3>
          <p className="text-muted-foreground">
            Follow us on social media or check out our GitHub for the latest
            updates and stories.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/33Charles"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Maasai Beadwork Marketplace·
      </div>
    </footer>
  );
}
