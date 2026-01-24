import { Star, User } from "lucide-react";

interface ReviewCardProps {
  review: {
    id: string;
    rating: number;
    comment: string | null;
    created_at: string;
    profiles?: {
      full_name: string | null;
      avatar_url: string | null;
    };
  };
  index?: number;
}

export const ReviewCard = ({ review, index = 0 }: ReviewCardProps) => {
  return (
    <div 
      className="p-4 bg-card rounded-xl border border-border animate-appear hover-lift"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
          {review.profiles?.avatar_url ? (
            <img 
              src={review.profiles.avatar_url} 
              alt={review.profiles.full_name || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Name and Rating */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-medium text-sm truncate">
              {review.profiles?.full_name || "Client"}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < review.rating
                      ? "fill-afrimart-gold text-afrimart-gold"
                      : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Comment */}
          {review.comment && (
            <p className="text-sm text-muted-foreground">{review.comment}</p>
          )}

          {/* Date */}
          <p className="text-xs text-muted-foreground/70 mt-2">
            {new Date(review.created_at).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
