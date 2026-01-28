import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import StoryCircles from "./StoryCircles";

interface HomeStoriesSectionProps {
  currentUserId?: string | null;
}

const HomeStoriesSection = ({ currentUserId }: HomeStoriesSectionProps) => {
  const [hasStories, setHasStories] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkForStories();
  }, []);

  const checkForStories = async () => {
    try {
      const now = new Date().toISOString();
      
      const { count, error } = await supabase
        .from("business_media")
        .select("id", { count: "exact", head: true })
        .eq("media_type", "story")
        .or(`expires_at.is.null,expires_at.gt.${now}`);

      if (error) throw error;
      setHasStories((count || 0) > 0);
    } catch (error) {
      console.error("Error checking stories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !hasStories) return null;

  return (
    <section className="container mx-auto px-4 py-2">
      <StoryCircles currentUserId={currentUserId} />
    </section>
  );
};

export default HomeStoriesSection;
