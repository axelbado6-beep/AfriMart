import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Building2, ShoppingBag, Users, Sparkles, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import afrimartLogo from "@/assets/afrimart-logo.jpg";

const Index = () => {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-primary african-pattern relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-afrimart-pattern opacity-50" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-afrimart-green/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-afrimart-orange/10 rounded-full blur-3xl" />
      
      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={afrimartLogo} 
              alt="AfriMart Logo" 
              className="w-12 h-12 rounded-full object-cover"
            />
            <span className="text-2xl font-display font-bold text-primary-foreground">
              Afri<span className="text-gradient">Mart</span>
            </span>
          </div>
          
          {session ? (
            <Link
              to="/dashboard"
              className="px-6 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-300 backdrop-blur-sm border border-primary-foreground/20"
            >
              Mon Dashboard
            </Link>
          ) : (
            <Link
              to="/auth"
              className="px-6 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 transition-all duration-300 backdrop-blur-sm border border-primary-foreground/20"
            >
              Connexion
            </Link>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 container mx-auto px-6 pt-12 pb-24">
        <div className="text-center mb-16 animate-fade-up">
          {/* Logo centered */}
          <div className="mb-8">
            <img 
              src={afrimartLogo} 
              alt="AfriMart" 
              className="w-32 h-32 mx-auto rounded-2xl shadow-2xl object-cover"
            />
          </div>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 text-primary-foreground/80 text-sm mb-6 backdrop-blur-sm border border-primary-foreground/10">
            <Sparkles className="w-4 h-4 text-afrimart-orange" />
            <span>La première marketplace africaine avec réseau social</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-primary-foreground mb-6 leading-tight">
            Connectez-vous à l'
            <span className="text-gradient">Afrique</span>
            <br />
            qui entreprend
          </h1>
          
          <p className="text-lg md:text-xl text-primary-foreground/70 max-w-2xl mx-auto mb-12">
            Découvrez des milliers d'entreprises africaines, suivez vos favoris, 
            et achetez en toute sécurité avec AfriMart Pay.
          </p>
        </div>

        {/* Choice Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Client Card */}
          <Link
            to="/auth?type=client"
            className="group relative animate-fade-up stagger-1"
          >
            <div className="absolute inset-0 bg-afrimart-green/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
            <div className="relative bg-card/10 backdrop-blur-md border border-primary-foreground/10 rounded-3xl p-8 md:p-10 transition-all duration-500 hover:border-afrimart-green/50 hover:bg-card/20 overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-afrimart-green/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative">
                <div className="w-20 h-20 rounded-full btn-client flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <User className="w-10 h-10 text-primary-foreground" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-3">
                  Je suis <span className="text-gradient-green">Client</span>
                </h2>
                
                <p className="text-primary-foreground/60 mb-6">
                  Explorez des milliers de produits, suivez vos entreprises favorites 
                  et achetez en toute sécurité.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {["Feed personnalisé", "Paiement sécurisé", "Chat avec vendeurs"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-primary-foreground/70">
                      <div className="w-2 h-2 rounded-full bg-afrimart-green" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center gap-2 text-afrimart-green font-semibold group-hover:gap-4 transition-all duration-300">
                  Commencer <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>

          {/* Business Card */}
          <Link
            to="/auth?type=business"
            className="group relative animate-fade-up stagger-2"
          >
            <div className="absolute inset-0 bg-afrimart-orange/30 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100" />
            <div className="relative bg-card/10 backdrop-blur-md border border-primary-foreground/10 rounded-3xl p-8 md:p-10 transition-all duration-500 hover:border-afrimart-orange/50 hover:bg-card/20 overflow-hidden">
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-afrimart-orange/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              
              <div className="relative">
                <div className="w-20 h-20 rounded-full btn-business flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500" style={{ background: 'linear-gradient(135deg, hsl(25 95% 55%), hsl(45 90% 55%))' }}>
                  <Building2 className="w-10 h-10 text-primary-foreground" />
                </div>
                
                <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-3">
                  Je suis <span className="text-gradient">Entreprise</span>
                </h2>
                
                <p className="text-primary-foreground/60 mb-6">
                  Vendez vos produits, développez votre communauté 
                  et acceptez les paiements Mobile Money.
                </p>
                
                <ul className="space-y-3 mb-8">
                  {["Catalogue illimité", "Dashboard avancé", "Paiements Mobile Money"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-primary-foreground/70">
                      <div className="w-2 h-2 rounded-full bg-afrimart-orange" />
                      {item}
                    </li>
                  ))}
                </ul>
                
                <div className="flex items-center gap-2 text-afrimart-orange font-semibold group-hover:gap-4 transition-all duration-300">
                  Commencer <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto animate-fade-up stagger-3">
          {[
            { value: "10K+", label: "Entreprises", icon: Building2 },
            { value: "50K+", label: "Clients", icon: Users },
            { value: "100K+", label: "Produits", icon: ShoppingBag },
            { value: "5", label: "Pays", icon: Sparkles },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 rounded-2xl bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10">
              <stat.icon className="w-6 h-6 text-afrimart-orange mx-auto mb-3" />
              <div className="text-3xl font-display font-bold text-primary-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-primary-foreground/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-primary-foreground/10 py-8">
        <div className="container mx-auto px-6 text-center text-primary-foreground/50 text-sm">
          © 2024 AfriMart. Fièrement africain 🌍
        </div>
      </footer>
    </div>
  );
};

export default Index;
