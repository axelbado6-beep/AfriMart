import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  business_id: string;
  client_id: string;
  product_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
  profiles?: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<number, number>;
}

export const useReviews = (businessId: string | null, productId?: string | null) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState<Review | null>(null);

  const fetchReviews = useCallback(async () => {
    if (!businessId) {
      setLoading(false);
      return;
    }

    try {
      let query = supabase
        .from("reviews")
        .select(`
          *,
          profiles:client_id (
            full_name,
            avatar_url
          )
        `)
        .eq("business_id", businessId)
        .order("created_at", { ascending: false });

      if (productId) {
        query = query.eq("product_id", productId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Type assertion for the joined data
      const reviewsData = (data || []) as unknown as Review[];
      setReviews(reviewsData);

      // Calculate stats
      if (reviewsData.length > 0) {
        const total = reviewsData.length;
        const sum = reviewsData.reduce((acc, r) => acc + r.rating, 0);
        const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviewsData.forEach((r) => {
          distribution[r.rating] = (distribution[r.rating] || 0) + 1;
        });

        setStats({
          averageRating: sum / total,
          totalReviews: total,
          ratingDistribution: distribution,
        });
      }

      // Check if current user has a review
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const existing = reviewsData.find((r) => r.client_id === user.id);
        setUserReview(existing || null);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  }, [businessId, productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const submitReview = async (rating: number, comment: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !businessId) {
      throw new Error("User must be logged in");
    }

    const reviewData = {
      business_id: businessId,
      client_id: user.id,
      product_id: productId || null,
      rating,
      comment: comment || null,
    };

    if (userReview) {
      // Update existing review
      const { error } = await supabase
        .from("reviews")
        .update({ rating, comment: comment || null })
        .eq("id", userReview.id);

      if (error) throw error;
    } else {
      // Create new review
      const { error } = await supabase
        .from("reviews")
        .insert(reviewData);

      if (error) throw error;
    }

    await fetchReviews();
  };

  const deleteReview = async () => {
    if (!userReview) return;

    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("id", userReview.id);

    if (error) throw error;

    setUserReview(null);
    await fetchReviews();
  };

  return {
    reviews,
    stats,
    loading,
    userReview,
    submitReview,
    deleteReview,
    refetch: fetchReviews,
  };
};
