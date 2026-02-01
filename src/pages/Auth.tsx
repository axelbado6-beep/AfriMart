import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShoppingBag, Mail, Lock, User, Building2, ArrowLeft, Eye, EyeOff, Phone, Sparkles } from "lucide-react";
import { z } from "zod";
import UserTypeSelector from "@/components/auth/UserTypeSelector";
import afrimartLogo from "@/assets/afrimart-logo.jpg";

const emailSchema = z.string().email("Email invalide");
const passwordSchema = z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères");
const phoneSchema = z.string().regex(/^(\+225|00225)?[0-9]{10}$/, "Numéro de téléphone invalide");

const Auth = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = searchParams.get("type") as "client" | "business" | null;
  const [userType, setUserType] = useState<"client" | "business" | null>(initialType);
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  // Update URL when userType changes
  useEffect(() => {
    if (userType) {
      setSearchParams({ type: userType });
    }
  }, [userType, setSearchParams]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    try {
      emailSchema.parse(email);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.email = e.errors[0].message;
      }
    }
    
    try {
      passwordSchema.parse(password);
    } catch (e) {
      if (e instanceof z.ZodError) {
        newErrors.password = e.errors[0].message;
      }
    }
    
    if (!isLogin) {
      if (!fullName.trim()) {
        newErrors.fullName = "Nom complet requis";
      }
      
      if (userType === "business" && !businessName.trim()) {
        newErrors.businessName = "Nom de l'entreprise requis";
      }
      
      if (phone) {
        try {
          phoneSchema.parse(phone);
        } catch (e) {
          if (e instanceof z.ZodError) {
            newErrors.phone = e.errors[0].message;
          }
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              variant: "destructive",
              title: "Erreur de connexion",
              description: "Email ou mot de passe incorrect",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: error.message,
            });
          }
        }
      } else {
        const redirectUrl = `${window.location.origin}/`;
        
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
              user_type: userType,
              business_name: userType === "business" ? businessName : undefined,
              phone: phone || undefined,
            },
          },
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              variant: "destructive",
              title: "Compte existant",
              description: "Un compte avec cet email existe déjà. Veuillez vous connecter.",
            });
            setIsLogin(true);
          } else {
            toast({
              variant: "destructive",
              title: "Erreur",
              description: error.message,
            });
          }
        } else {
          toast({
            title: "Compte créé !",
            description: "Vérifiez votre email pour confirmer votre inscription.",
          });
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show user type selector if no type is selected
  if (!userType) {
    return <UserTypeSelector onSelect={setUserType} />;
  }

  const isClient = userType === "client";
  const accentColor = isClient ? "afrimart-green" : "afrimart-orange";
  const gradientClass = isClient ? "btn-client" : "btn-business";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-afrimart-blue relative overflow-hidden flex items-center justify-center p-6">
      {/* Background Decorations */}
      <div className="absolute inset-0 bg-afrimart-pattern opacity-50" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-afrimart-green/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-afrimart-orange/10 rounded-full blur-3xl animate-pulse-slow stagger-3" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-afrimart-gold/5 rounded-full blur-3xl animate-morph" />
      
      {/* Floating Decorations */}
      <div className="absolute top-20 left-20 text-4xl opacity-30 animate-float">✨</div>
      <div className="absolute bottom-32 right-20 text-3xl opacity-20 animate-float stagger-2">🌍</div>
      <div className="absolute top-1/3 right-10 text-2xl opacity-20 animate-bounce-soft">
        {isClient ? "🛍️" : "📦"}
      </div>

      <div className="relative z-10 w-full max-w-md animate-fade-in-up">
        {/* Back Button */}
        <button
          onClick={() => setUserType(null)}
          className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-8 transition-all duration-300 hover:gap-3 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Changer d'espace
        </button>

        {/* Card */}
        <div className="bg-card/10 backdrop-blur-xl border border-primary-foreground/10 rounded-3xl p-8 shadow-2xl animate-scale-in">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-afrimart-orange to-afrimart-gold opacity-50 blur group-hover:opacity-100 transition-opacity" />
              <img 
                src={afrimartLogo} 
                alt="AfriMart" 
                className="relative w-14 h-14 rounded-full object-cover shadow-xl group-hover:scale-110 transition-transform"
              />
            </div>
            <span className="text-2xl font-display font-bold text-primary-foreground">
              Afri<span className="text-gradient animate-gradient-x bg-[length:200%_auto]">Mart</span>
            </span>
          </div>

          {/* User Type Badge */}
          <div className="flex justify-center mb-6">
            <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full ${isClient ? 'bg-afrimart-green/20 text-afrimart-green border border-afrimart-green/30' : 'bg-afrimart-orange/20 text-afrimart-orange border border-afrimart-orange/30'} animate-bounce-in`}>
              {isClient ? <User className="w-4 h-4 animate-bounce-soft" /> : <Building2 className="w-4 h-4 animate-bounce-soft" />}
              <span className="text-sm font-semibold">
                {isClient ? "Espace Client" : "Espace Entreprise"}
              </span>
              <Sparkles className="w-3 h-3 animate-pulse-slow" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-display font-bold text-primary-foreground text-center mb-2">
            {isLogin ? "Connexion" : "Inscription"}
          </h1>
          <p className="text-primary-foreground/60 text-center mb-8">
            {isLogin 
              ? "Connectez-vous à votre compte" 
              : `Créez votre compte ${isClient ? "client" : "entreprise"}`
            }
          </p>

          {/* Form */}
          <form onSubmit={handleAuth} className="space-y-5">
            {!isLogin && (
              <>
                <div className="space-y-2 animate-fade-in">
                  <Label htmlFor="fullName" className="text-primary-foreground/80">
                    Nom complet
                  </Label>
                  <div className="relative group">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/40 group-focus-within:text-afrimart-green transition-colors" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Votre nom complet"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-11 h-12 bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-afrimart-green focus:ring-2 focus:ring-afrimart-green/20 rounded-xl transition-all"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="text-destructive text-sm animate-shake">{errors.fullName}</p>
                  )}
                </div>

                {userType === "business" && (
                  <div className="space-y-2 animate-fade-in stagger-1">
                    <Label htmlFor="businessName" className="text-primary-foreground/80">
                      Nom de l'entreprise
                    </Label>
                    <div className="relative group">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/40 group-focus-within:text-afrimart-orange transition-colors" />
                      <Input
                        id="businessName"
                        type="text"
                        placeholder="Nom de votre entreprise"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="pl-11 h-12 bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 focus:border-afrimart-orange focus:ring-2 focus:ring-afrimart-orange/20 rounded-xl transition-all"
                      />
                    </div>
                    {errors.businessName && (
                      <p className="text-destructive text-sm animate-shake">{errors.businessName}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2 animate-fade-in stagger-2">
                  <Label htmlFor="phone" className="text-primary-foreground/80">
                    Téléphone (optionnel)
                  </Label>
                  <div className="relative group">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/40 group-focus-within:text-primary transition-colors" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+225 XX XX XX XX XX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="pl-11 h-12 bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 rounded-xl transition-all"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-destructive text-sm animate-shake">{errors.phone}</p>
                  )}
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary-foreground/80">
                Email
              </Label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/40 group-focus-within:text-primary transition-colors" />
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12 bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 rounded-xl transition-all"
                />
              </div>
              {errors.email && (
                <p className="text-destructive text-sm animate-shake">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-primary-foreground/80">
                Mot de passe
              </Label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-foreground/40 group-focus-within:text-primary transition-colors" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12 bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40 rounded-xl transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/40 hover:text-primary-foreground/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-sm animate-shake">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={`w-full h-14 rounded-xl font-semibold text-lg text-primary-foreground ${gradientClass} shadow-xl hover:shadow-2xl transition-all duration-300`}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Chargement...
                </div>
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin ? "Se connecter" : "Créer mon compte"}
                  <Sparkles className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Toggle */}
          <p className="text-center text-primary-foreground/60 mt-6">
            {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setErrors({});
              }}
              className={`font-semibold hover:underline transition-colors ${isClient ? 'text-afrimart-green hover:text-afrimart-green/80' : 'text-afrimart-orange hover:text-afrimart-orange/80'}`}
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>

          {/* Switch User Type */}
          <div className="mt-6 pt-6 border-t border-primary-foreground/10">
            <p className="text-center text-primary-foreground/50 text-sm">
              {isClient ? "Vous êtes une entreprise ?" : "Vous êtes un client ?"}{" "}
              <button
                onClick={() => setUserType(isClient ? "business" : "client")}
                className={`font-semibold hover:underline transition-colors ${isClient ? 'text-afrimart-orange' : 'text-afrimart-green'}`}
              >
                {isClient ? "Espace Entreprise" : "Espace Client"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
