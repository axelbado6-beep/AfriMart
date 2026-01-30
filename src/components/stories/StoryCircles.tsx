import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Store } from "lucide-react";
import StoryViewer from "./StoryViewer";

interface Story {
  id: string;
  media_url: string;
  thumbnail_url: string | null;
  media_type: string;
  created_at: string;
  expires_at: string | null;
  business_id: string;
}

interface BusinessWithStories {
  id: string;
  business_name: string;
  logo_url: string | null;
  stories: Story[];
}

interface StoryCirclesProps {
  businessId?: string; // If provided, only show stories from this business
  showAddButton?: boolean; // Show add button for business owner
  onAddClick?: () => void;
  currentUserId?: string | null;
  isOwner?: boolean;
}

const StoryCircles = ({ 
  businessId, 
  showAddButton = false, 
  onAddClick,
  currentUserId,
  isOwner = false
}: StoryCirclesProps) => {
  const navigate = useNavigate();
  const [businessesWithStories, setBusinessesWithStories] = useState<BusinessWithStories[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithStories | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    fetchStories();
  }, [businessId]);

  const fetchStories = async () => {
    try {
      let query = supabase
        .from("business_media")
        .select(`
          id,
          media_url,
          thumbnail_url,
          media_type,
          created_at,
          expires_at,
          business_id,
          business_profiles!inner (
            id,
            business_name,
            logo_url
          )
        `)
        .eq("media_type", "story")
        .order("created_at", { ascending: false });

      // Filter by business if specified
      if (businessId) {
        query = query.eq("business_id", businessId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Filter out expired stories
      const now = new Date();
      const activeStories = (data || []).filter(story => {
        if (!story.expires_at) return true; // Permanent stories
        return new Date(story.expires_at) > now;
      });

      // Group stories by business
      const businessMap = new Map<string, BusinessWithStories>();
      
      activeStories.forEach((story: any) => {
        const bp = story.business_profiles;
        if (!businessMap.has(bp.id)) {
          businessMap.set(bp.id, {
            id: bp.id,
            business_name: bp.business_name,
            logo_url: bp.logo_url,
            stories: [],
          });
        }
        businessMap.get(bp.id)!.stories.push({
          id: story.id,
          media_url: story.media_url,
          thumbnail_url: story.thumbnail_url,
          media_type: story.media_type,
          created_at: story.created_at,
          expires_at: story.expires_at,
          business_id: story.business_id,
        });
      });

      setBusinessesWithStories(Array.from(businessMap.values()));
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoryClick = (business: BusinessWithStories) => {
    setSelectedBusiness(business);
    setViewerOpen(true);
  };

  if (loading) {
    return (
      <div className="flex gap-4 overflow-x-auto py-4 px-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2 flex-shrink-0">
            <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
            <div className="w-12 h-3 bg-muted rounded animate-pulse" />
          </div>
        ))}
      </div>
    );
  }

  // Don't show section if no stories and no add button
  if (businessesWithStories.length === 0 && !showAddButton) {
    return null;
  }

  return (
    <>
      <div className="flex gap-4 overflow-x-auto py-4 px-2 scrollbar-hide">
        {/* Add Story Button (only for business owners viewing their own profile) */}
        {showAddButton && isOwner && (
          <button
            onClick={onAddClick}
            className="flex flex-col items-center gap-2 flex-shrink-0 animate-bounce-in"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-afrimart-orange to-afrimart-gold flex items-center justify-center relative transition-all duration-300 hover:scale-110 hover:shadow-lg active:scale-95">
              <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center">
                <Plus className="w-6 h-6 text-afrimart-orange" />
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Ajouter</span>
          </button>
        )}

        {/* Story Circles */}
        {businessesWithStories.map((business, index) => (
          <button
            key={business.id}
            onClick={() => handleStoryClick(business)}
            className="flex flex-col items-center gap-2 flex-shrink-0 group animate-fade-in opacity-0"
            style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'forwards' }}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-afrimart-orange via-afrimart-gold to-afrimart-green p-0.5 animate-pulse-slow transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-active:scale-95">
              <div className="w-full h-full rounded-full bg-background p-0.5">
                <div className="w-full h-full rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  {business.logo_url ? (
                    <img 
                      src={business.logo_url} 
                      alt={business.business_name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <Store className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>
            <span className="text-xs text-center max-w-16 truncate group-hover:text-primary transition-colors duration-200">
              {business.business_name}
            </span>
          </button>
        ))}
      </div>

      {/* Story Viewer */}
      {selectedBusiness && (
        <StoryViewer
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          business={selectedBusiness}
          stories={selectedBusiness.stories}
        />
      )}
    </>
  );
};

export default StoryCircles;
