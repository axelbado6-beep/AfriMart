import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Store, MapPin, Phone, Camera, Loader2, Image } from "lucide-react";

const businessSchema = z.object({
  business_name: z.string().trim().min(1, "Le nom est requis").max(100, "Le nom ne doit pas dépasser 100 caractères"),
  description: z.string().trim().max(500, "La description ne doit pas dépasser 500 caractères").optional(),
  category: z.string().optional(),
  location: z.string().trim().max(200, "L'adresse ne doit pas dépasser 200 caractères").optional(),
  country: z.string().optional(),
  phone: z.string().trim().max(20, "Le numéro ne doit pas dépasser 20 caractères").optional(),
});

type BusinessFormData = z.infer<typeof businessSchema>;

interface BusinessProfile {
  id: string;
  user_id: string;
  business_name: string;
  logo_url: string | null;
  banner_url: string | null;
  category: string | null;
  description: string | null;
  is_verified: boolean;
  followers_count: number;
  location: string | null;
  country: string | null;
  phone: string | null;
}

interface BusinessSettingsProps {
  businessProfile: BusinessProfile | null;
  onBusinessUpdate: () => void;
}

const CATEGORIES = [
  "Mode & Accessoires",
  "Alimentation",
  "Électronique",
  "Beauté & Bien-être",
  "Maison & Décoration",
  "Services",
  "Artisanat",
  "Agriculture",
  "Autre",
];

const COUNTRIES = [
  "Côte d'Ivoire",
  "Sénégal",
  "Mali",
  "Burkina Faso",
  "Guinée",
  "Cameroun",
  "Bénin",
  "Togo",
  "Niger",
  "Ghana",
  "Nigeria",
];

const BusinessSettings = ({ businessProfile, onBusinessUpdate }: BusinessSettingsProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BusinessFormData>({
    resolver: zodResolver(businessSchema),
    defaultValues: {
      business_name: businessProfile?.business_name || "",
      description: businessProfile?.description || "",
      category: businessProfile?.category || "",
      location: businessProfile?.location || "",
      country: businessProfile?.country || "Côte d'Ivoire",
      phone: businessProfile?.phone || "",
    },
  });

  const category = watch("category");
  const country = watch("country");

  const onSubmit = async (data: BusinessFormData) => {
    if (!businessProfile) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("business_profiles")
        .update({
          business_name: data.business_name,
          description: data.description || null,
          category: data.category || null,
          location: data.location || null,
          country: data.country || null,
          phone: data.phone || null,
        })
        .eq("id", businessProfile.id);

      if (error) throw error;

      toast({
        title: "Profil entreprise mis à jour",
        description: "Les informations ont été enregistrées avec succès.",
      });
      onBusinessUpdate();
    } catch (error) {
      console.error("Error updating business profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil entreprise.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "logo" | "banner"
  ) => {
    const file = event.target.files?.[0];
    if (!file || !businessProfile) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Format non supporté",
        description: "Utilisez une image JPG, PNG ou WebP.",
        variant: "destructive",
      });
      return;
    }

    const maxSize = type === "banner" ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: `L'image ne doit pas dépasser ${type === "banner" ? "5" : "2"} Mo.`,
        variant: "destructive",
      });
      return;
    }

    const setUploading = type === "logo" ? setIsUploadingLogo : setIsUploadingBanner;
    setUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${businessProfile.user_id}/${type}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      const updateField = type === "logo" ? "logo_url" : "banner_url";
      const { error: updateError } = await supabase
        .from("business_profiles")
        .update({ [updateField]: publicUrl })
        .eq("id", businessProfile.id);

      if (updateError) throw updateError;

      toast({
        title: type === "logo" ? "Logo mis à jour" : "Bannière mise à jour",
        description: "L'image a été changée avec succès.",
      });
      onBusinessUpdate();
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger l'image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  if (!businessProfile) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="w-5 h-5" />
          Informations entreprise
        </CardTitle>
        <CardDescription>
          Gérez les informations de votre entreprise
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Logo & Banner */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={businessProfile.logo_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {businessProfile.business_name?.charAt(0)?.toUpperCase() || "E"}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="logo-upload"
                  className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90 transition-colors"
                >
                  {isUploadingLogo ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Camera className="w-3 h-3" />
                  )}
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "logo")}
                  disabled={isUploadingLogo}
                />
              </div>
              <div>
                <p className="text-sm font-medium">Logo de l'entreprise</p>
                <p className="text-xs text-muted-foreground">
                  JPG, PNG ou WebP. Max 2 Mo.
                </p>
              </div>
            </div>

            {/* Banner */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Image className="w-4 h-4" />
                Bannière
              </Label>
              <div className="relative aspect-[3/1] rounded-lg overflow-hidden bg-muted">
                {businessProfile.banner_url ? (
                  <img
                    src={businessProfile.banner_url}
                    alt="Bannière"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <Image className="w-8 h-8" />
                  </div>
                )}
                <label
                  htmlFor="banner-upload"
                  className="absolute bottom-2 right-2 px-3 py-1.5 rounded-md bg-background/80 backdrop-blur-sm text-sm font-medium cursor-pointer hover:bg-background transition-colors flex items-center gap-2"
                >
                  {isUploadingBanner ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Camera className="w-4 h-4" />
                  )}
                  Modifier
                </label>
                <input
                  id="banner-upload"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleImageUpload(e, "banner")}
                  disabled={isUploadingBanner}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Recommandé: 1200x400px. Max 5 Mo.
              </p>
            </div>
          </div>

          {/* Business Name */}
          <div className="space-y-2">
            <Label htmlFor="business_name">Nom de l'entreprise *</Label>
            <Input
              id="business_name"
              placeholder="Nom de votre entreprise"
              {...register("business_name")}
            />
            {errors.business_name && (
              <p className="text-sm text-destructive">{errors.business_name.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez votre entreprise..."
              rows={3}
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>Catégorie</Label>
            <Select
              value={category}
              onValueChange={(value) => setValue("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Country */}
          <div className="space-y-2">
            <Label>Pays</Label>
            <Select
              value={country}
              onValueChange={(value) => setValue("country", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un pays" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Adresse
            </Label>
            <Input
              id="location"
              placeholder="Votre adresse complète"
              {...register("location")}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="business_phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Téléphone professionnel
            </Label>
            <Input
              id="business_phone"
              placeholder="+225 XX XX XX XX"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone.message}</p>
            )}
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BusinessSettings;
