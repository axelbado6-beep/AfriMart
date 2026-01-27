import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { CartDrawer } from "@/components/cart/CartDrawer";
import afrimartLogo from "@/assets/afrimart-logo.jpg";

interface PublicHeaderProps {
  onSearch?: (query: string) => void;
}

export function PublicHeader({ onSearch }: PublicHeaderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery)}`);
      onSearch?.(searchQuery);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img 
                src={afrimartLogo} 
                alt="AfriMart" 
                className="w-10 h-10 rounded-full object-cover"
              />
              <span className="text-xl font-display font-bold text-foreground hidden sm:block">
                Afri<span className="text-gradient">Mart</span>
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher des produits, entreprises..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 bg-muted/50 border-border focus:bg-background"
                />
              </div>
            </form>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex"
                onClick={() => navigate("/catalog")}
              >
                Explorer
              </Button>

              <CartDrawer />

              {session ? (
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="hidden sm:flex btn-client text-primary-foreground"
                  size="sm"
                >
                  Mon Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/auth")}
                  className="hidden sm:flex"
                  size="sm"
                >
                  Connexion
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="md:hidden mt-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-muted/50 border-border"
              />
            </div>
          </form>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4 space-y-2 animate-fade-up">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  navigate("/catalog");
                  setMobileMenuOpen(false);
                }}
              >
                Explorer le catalogue
              </Button>
              {session ? (
                <Button
                  className="w-full btn-client text-primary-foreground"
                  onClick={() => {
                    navigate("/dashboard");
                    setMobileMenuOpen(false);
                  }}
                >
                  Mon Dashboard
                </Button>
              ) : (
                <Button
                  className="w-full"
                  onClick={() => {
                    navigate("/auth");
                    setMobileMenuOpen(false);
                  }}
                >
                  Connexion
                </Button>
              )}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}
