import { useState, useEffect } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useReviews } from "@/hooks/useReviews";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import { ReviewStats } from "./ReviewStats";
import { supabase } from "@/integrations/supabase/client";

interface ReviewSectionProps {
  businessId: string;
  productId?: string;
  showForm?: boolean;
}

export const ReviewSection = ({ businessId, productId, showForm = true }: ReviewSectionProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const { reviews, stats, loading, userReview, submitReview, deleteReview } = useReviews(businessId, productId);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted rounded-xl animate-pulse" />
        <div className="h-24 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 fill-afrimart-gold text-afrimart-gold" />
        <h3 className="text-lg font-display font-semibold">Avis clients</h3>
        <span className="text-sm text-muted-foreground">
          ({stats.totalReviews})
        </span>
      </div>

      {/* Stats */}
      {stats.totalReviews > 0 && <ReviewStats stats={stats} />}

      {/* Review Form - Only show if user is logged in and hasn't reviewed yet or wants to edit */}
      {showForm && userId && (
        <ReviewForm
          existingReview={userReview}
          onSubmit={submitReview}
          onDelete={userReview ? deleteReview : undefined}
        />
      )}

      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-3">
          {displayedReviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}

          {reviews.length > 3 && (
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setShowAllReviews(!showAllReviews)}
            >
              {showAllReviews ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-2" />
                  Voir moins
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-2" />
                  Voir les {reviews.length - 3} autres avis
                </>
              )}
            </Button>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <Star className="w-12 h-12 mx-auto mb-2 opacity-20" />
          <p>Aucun avis pour le moment</p>
          {userId && <p className="text-sm">Soyez le premier à donner votre avis !</p>}
        </div>
      )}
    </div>
  );
};
