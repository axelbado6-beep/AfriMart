import { useState } from "react";
import { Star, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ReviewFormProps {
  existingReview?: {
    rating: number;
    comment: string | null;
  } | null;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export const ReviewForm = ({ existingReview, onSubmit, onDelete }: ReviewFormProps) => {
  const { toast } = useToast();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState(existingReview?.comment || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Note requise",
        description: "Veuillez sélectionner une note avant de soumettre",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await onSubmit(rating, comment);
      toast({
        title: existingReview ? "Avis modifié" : "Avis publié",
        description: "Merci pour votre retour !",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de publier l'avis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    setLoading(true);
    try {
      await onDelete();
      setRating(0);
      setComment("");
      toast({
        title: "Avis supprimé",
        description: "Votre avis a été supprimé",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'avis",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-card rounded-xl border border-border space-y-4 animate-scale-in">
      <h4 className="font-semibold">
        {existingReview ? "Modifier votre avis" : "Laisser un avis"}
      </h4>

      {/* Star Rating */}
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <button
            key={i}
            type="button"
            onMouseEnter={() => setHoverRating(i + 1)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(i + 1)}
            className="p-1 transition-transform hover:scale-110"
          >
            <Star
              className={`w-7 h-7 transition-colors ${
                i < (hoverRating || rating)
                  ? "fill-afrimart-gold text-afrimart-gold"
                  : "text-muted-foreground/30"
              }`}
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating > 0 && (
            <>
              {rating === 1 && "Très mauvais"}
              {rating === 2 && "Mauvais"}
              {rating === 3 && "Correct"}
              {rating === 4 && "Bien"}
              {rating === 5 && "Excellent"}
            </>
          )}
        </span>
      </div>

      {/* Comment */}
      <Textarea
        placeholder="Partagez votre expérience (optionnel)..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={3}
        className="resize-none"
      />

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={loading || rating === 0}
          className="flex-1 btn-client"
        >
          <Send className="w-4 h-4 mr-2" />
          {existingReview ? "Modifier" : "Publier"}
        </Button>
        {existingReview && onDelete && (
          <Button
            variant="outline"
            onClick={handleDelete}
            disabled={loading}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
