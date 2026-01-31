import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchSuggestions } from "./SearchSuggestions";
import afrimartLogo from "@/assets/afrimart-logo.jpg";

interface PublicHeaderProps {
  onSearch?: (query: string) => void;
}

export function PublicHeader({ onSearch }: PublicHeaderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
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
      setShowSuggestions(false);
    }
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion);
    navigate(`/catalog?search=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo with animation */}
            <Link to="/" className="flex items-center gap-2 shrink-0 group">
              <div className="relative">
                <img 
                  src={afrimartLogo} 
                  alt="AfriMart" 
                  className="w-10 h-10 rounded-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-afrimart-orange to-afrimart-gold opacity-0 group-hover:opacity-30 transition-opacity blur-sm" />
              </div>
              <span className="text-xl font-display font-bold text-foreground hidden sm:block group-hover:tracking-wider transition-all duration-300">
                Afri<span className="text-gradient animate-gradient-x bg-[length:200%_auto]">Mart</span>
              </span>
            </Link>

            {/* Search Bar - Desktop with suggestions */}
            <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-xl relative">
              <form onSubmit={handleSearch}>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    type="search"
                    placeholder="Rechercher des produits, entreprises..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    className="pl-10 pr-4 bg-muted/50 border-border focus:bg-background transition-all duration-300 focus:shadow-lg focus:shadow-primary/10 focus:border-primary/50"
                  />
                  {/* Animated sparkle icon */}
                  {searchQuery && (
                    <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-afrimart-gold animate-pulse-slow" />
                  )}
                </div>
              </form>
              
              {/* Search Suggestions Dropdown */}
              <SearchSuggestions
                query={searchQuery}
                onSelect={handleSuggestionSelect}
                isVisible={showSuggestions}
                onClose={() => setShowSuggestions(false)}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex hover:scale-105 active:scale-95 transition-transform duration-200"
                onClick={() => navigate("/catalog")}
              >
                Explorer
              </Button>

              <CartDrawer />

              {session ? (
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="hidden sm:flex btn-client text-primary-foreground hover:animate-jelly"
                  size="sm"
                >
                  Mon Dashboard
                </Button>
              ) : (
                <Button
                  onClick={() => navigate("/auth")}
                  className="hidden sm:flex hover:scale-105 active:scale-95 transition-transform"
                  size="sm"
                >
                  Connexion
                </Button>
              )}

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden hover:rotate-180 transition-transform duration-300"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Search with suggestions */}
          <div className="md:hidden mt-3 relative">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="pl-10 pr-4 bg-muted/50 border-border"
                />
              </div>
            </form>
            
            {/* Mobile Search Suggestions */}
            <SearchSuggestions
              query={searchQuery}
              onSelect={handleSuggestionSelect}
              isVisible={showSuggestions}
              onClose={() => setShowSuggestions(false)}
            />
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-border pt-4 space-y-2 animate-slide-down">
              <Button
                variant="ghost"
                className="w-full justify-start hover:translate-x-2 transition-transform duration-200"
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