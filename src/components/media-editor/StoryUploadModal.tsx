import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  Clock, 
  Loader2,
  Camera
} from "lucide-react";
import MediaEditor from "./MediaEditor";

interface StoryUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessId: string;
  onSuccess: () => void;
}

type DurationType = "24h" | "48h" | "permanent";

const StoryUploadModal = ({ 
  open, 
  onOpenChange, 
  businessId, 
  onSuccess 
}: StoryUploadModalProps) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [step, setStep] = useState<"select" | "edit" | "options">("select");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editedBlob, setEditedBlob] = useState<Blob | null>(null);
  const [thumbnail, setThumbnail] = useState<Blob | null>(null);
  const [duration, setDuration] = useState<DurationType>("24h");
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast({
        title: "Format non supporté",
        description: "Veuillez sélectionner une image ou une vidéo",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 100MB for videos, 20MB for images)
    const maxSize = file.type.startsWith("video/") ? 100 * 1024 * 1024 : 20 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Fichier trop volumineux",
        description: `Taille maximale: ${file.type.startsWith("video/") ? "100MB" : "20MB"}`,
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setStep("edit");
  };

  const handleEditorSave = (blob: Blob, thumb: Blob | null) => {
    setEditedBlob(blob);
    setThumbnail(thumb);
    setStep("options");
  };

  const handleEditorCancel = () => {
    setSelectedFile(null);
    setStep("select");
  };

  const calculateExpiresAt = (durationType: DurationType): string | null => {
    if (durationType === "permanent") return null;
    
    const now = new Date();
    const hours = durationType === "24h" ? 24 : 48;
    now.setHours(now.getHours() + hours);
    return now.toISOString();
  };

  const handleUpload = async () => {
    if (!editedBlob || !selectedFile) return;

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${businessId}/stories/${Date.now()}.${fileExt}`;
      const thumbnailName = thumbnail ? `${businessId}/stories/thumbs/${Date.now()}.jpg` : null;

      // Upload main media
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, editedBlob, {
          contentType: selectedFile.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("products")
        .getPublicUrl(fileName);

      let thumbnailUrl = null;
      if (thumbnail && thumbnailName) {
        const { error: thumbError } = await supabase.storage
          .from("products")
          .upload(thumbnailName, thumbnail, {
            contentType: "image/jpeg",
            upsert: false,
          });
        
        if (!thumbError) {
          const { data: thumbUrlData } = supabase.storage
            .from("products")
            .getPublicUrl(thumbnailName);
          thumbnailUrl = thumbUrlData.publicUrl;
        }
      }

      // Insert story record
      const { error: insertError } = await supabase
        .from("business_media")
        .insert({
          business_id: businessId,
          media_type: "story",
          media_url: urlData.publicUrl,
          thumbnail_url: thumbnailUrl || urlData.publicUrl,
          duration_type: duration,
          expires_at: calculateExpiresAt(duration),
        });

      if (insertError) throw insertError;

      toast({
        title: "Story publiée !",
        description: duration === "permanent" 
          ? "Votre story restera visible jusqu'à suppression"
          : `Votre story sera visible pendant ${duration}`,
      });

      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Impossible de publier la story",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setStep("select");
    setSelectedFile(null);
    setEditedBlob(null);
    setThumbnail(null);
    setDuration("24h");
    onOpenChange(false);
  };

  // Show editor in fullscreen mode
  if (step === "edit" && selectedFile) {
    return (
      <MediaEditor 
        file={selectedFile}
        onSave={handleEditorSave}
        onCancel={handleEditorCancel}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-afrimart-orange" />
            Nouvelle Story
          </DialogTitle>
        </DialogHeader>

        {step === "select" && (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            <div 
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Sélectionner un média</h3>
              <p className="text-sm text-muted-foreground">
                Photo ou vidéo (max 100MB)
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "image/*";
                    fileInputRef.current.click();
                  }
                }}
              >
                <ImageIcon className="w-6 h-6" />
                <span>Photo</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto py-4 flex-col gap-2"
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "video/*";
                    fileInputRef.current.click();
                  }
                }}
              >
                <Video className="w-6 h-6" />
                <span>Vidéo</span>
              </Button>
            </div>
          </div>
        )}

        {step === "options" && (
          <div className="space-y-6">
            {/* Preview */}
            <div className="relative aspect-[9/16] max-h-64 mx-auto rounded-xl overflow-hidden bg-black">
              {editedBlob && selectedFile?.type.startsWith("image/") && (
                <img 
                  src={URL.createObjectURL(editedBlob)} 
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              )}
              {editedBlob && selectedFile?.type.startsWith("video/") && (
                <video 
                  src={URL.createObjectURL(editedBlob)} 
                  className="w-full h-full object-contain"
                  controls
                />
              )}
            </div>

            {/* Duration Selection */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Durée de visibilité
              </Label>
              <RadioGroup 
                value={duration} 
                onValueChange={(v) => setDuration(v as DurationType)}
                className="grid grid-cols-3 gap-3"
              >
                <div>
                  <RadioGroupItem 
                    value="24h" 
                    id="24h" 
                    className="peer sr-only" 
                  />
                  <Label 
                    htmlFor="24h"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span className="text-2xl font-bold">24h</span>
                    <span className="text-xs text-muted-foreground">1 jour</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem 
                    value="48h" 
                    id="48h" 
                    className="peer sr-only" 
                  />
                  <Label 
                    htmlFor="48h"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span className="text-2xl font-bold">48h</span>
                    <span className="text-xs text-muted-foreground">2 jours</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem 
                    value="permanent" 
                    id="permanent" 
                    className="peer sr-only" 
                  />
                  <Label 
                    htmlFor="permanent"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <span className="text-2xl font-bold">∞</span>
                    <span className="text-xs text-muted-foreground">Permanent</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setStep("edit")}
              >
                Modifier
              </Button>
              <Button 
                className="flex-1 btn-business"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Publication...
                  </>
                ) : (
                  "Publier"
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StoryUploadModal;
