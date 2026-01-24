import { Star } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ReviewStatsProps {
  stats: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  };
}

export const ReviewStats = ({ stats }: ReviewStatsProps) => {
  const { averageRating, totalReviews, ratingDistribution } = stats;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 bg-card rounded-xl border border-border animate-scale-in">
      {/* Average Rating */}
      <div className="flex flex-col items-center justify-center md:pr-6 md:border-r border-border">
        <div className="text-4xl font-bold text-foreground">
          {averageRating.toFixed(1)}
        </div>
        <div className="flex items-center gap-0.5 my-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.round(averageRating)
                  ? "fill-afrimart-gold text-afrimart-gold"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          {totalReviews} avis
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="flex-1 space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => {
          const count = ratingDistribution[rating] || 0;
          const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

          return (
            <div key={rating} className="flex items-center gap-3">
              <div className="flex items-center gap-1 w-12">
                <span className="text-sm font-medium">{rating}</span>
                <Star className="w-3.5 h-3.5 fill-afrimart-gold text-afrimart-gold" />
              </div>
              <Progress value={percentage} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground w-8 text-right">
                {count}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
