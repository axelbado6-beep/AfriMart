import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import afrimartLogo from "@/assets/afrimart-logo.jpg";

export function PublicFooter() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src={afrimartLogo} 
                alt="AfriMart" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-xl font-display font-bold">
                Afri<span className="text-gradient">Mart</span>
              </span>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-4">
              La première marketplace africaine qui connecte les entrepreneurs 
              aux consommateurs du continent.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link to="/catalog" className="hover:text-primary-foreground transition-colors">
                  Catalogue
                </Link>
              </li>
              <li>
                <Link to="/auth?type=business" className="hover:text-primary-foreground transition-colors">
                  Devenir vendeur
                </Link>
              </li>
              <li>
                <Link to="/auth" className="hover:text-primary-foreground transition-colors">
                  Créer un compte
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold mb-4">Catégories</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70">
              <li>
                <Link to="/catalog?category=Mode" className="hover:text-primary-foreground transition-colors">
                  Mode
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Électronique" className="hover:text-primary-foreground transition-colors">
                  Électronique
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Alimentation" className="hover:text-primary-foreground transition-colors">
                  Alimentation
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=Beauté" className="hover:text-primary-foreground transition-colors">
                  Beauté
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" />
                <span>Abidjan, Côte d'Ivoire</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+225 07 00 00 00 00</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>contact@afrimart.ci</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 text-center text-sm text-primary-foreground/50">
          <p>© {new Date().getFullYear()} AfriMart. Fièrement africain 🌍</p>
        </div>
      </div>
    </footer>
  );
}
