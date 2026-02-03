import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LiveSession {
  id: string;
  business_id: string;
  business_name: string;
  title: string;
  scheduled_at: string | null;
  started_at: string | null;
  ended_at: string | null;
  is_live: boolean;
  viewer_count: number;
}

interface LiveNotification {
  id: string;
  type: "live_start" | "live_scheduled" | "live_end";
  business_id: string;
  business_name: string;
  title: string;
  scheduled_at?: string;
  timestamp: string;
}

export const useLiveNotifications = (userId: string | null) => {
  const [activeLives, setActiveLives] = useState<LiveSession[]>([]);
  const [upcomingLives, setUpcomingLives] = useState<LiveSession[]>([]);
  const [liveNotifications, setLiveNotifications] = useState<LiveNotification[]>([]);

  // Fetch active and upcoming lives from businesses the user follows
  const fetchLives = useCallback(async () => {
    if (!userId) return;

    try {
      // Get active lives (from business_media with is_live = true)
      const { data: activeData } = await supabase
        .from("business_media")
        .select(`
          id,
          business_id,
          title,
          is_live,
          live_viewers,
          created_at,
          business_profiles!inner (
            business_name
          )
        `)
        .eq("media_type", "live")
        .eq("is_live", true);

      if (activeData) {
        const liveSessions: LiveSession[] = activeData.map((item: any) => ({
          id: item.id,
          business_id: item.business_id,
          business_name: item.business_profiles.business_name,
          title: item.title || "Live en cours",
          scheduled_at: null,
          started_at: item.created_at,
          ended_at: null,
          is_live: true,
          viewer_count: item.live_viewers || 0,
        }));
        setActiveLives(liveSessions);
      }
    } catch (error) {
      console.error("Error fetching live sessions:", error);
    }
  }, [userId]);

  // Subscribe to live session changes
  useEffect(() => {
    if (!userId) return;

    fetchLives();

    // Subscribe to business_media changes for live updates
    const channel = supabase
      .channel("live-sessions-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "business_media",
          filter: "media_type=eq.live",
        },
        (payload) => {
          if (payload.eventType === "INSERT" && payload.new.is_live) {
            // New live started
            fetchLives();
          } else if (payload.eventType === "UPDATE") {
            if (payload.new.is_live !== payload.old?.is_live) {
              // Live status changed
              fetchLives();
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchLives]);

  // Calculate time remaining for scheduled lives
  const getTimeRemaining = (scheduledAt: string): string => {
    const now = new Date();
    const scheduled = new Date(scheduledAt);
    const diffMs = scheduled.getTime() - now.getTime();

    if (diffMs <= 0) return "Maintenant";

    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `Dans ${diffDays}j`;
    if (diffHours > 0) return `Dans ${diffHours}h`;
    return `Dans ${diffMins}min`;
  };

  // Format viewer count
  const formatViewerCount = (count: number): string => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
    return count.toString();
  };

  return {
    activeLives,
    upcomingLives,
    liveNotifications,
    getTimeRemaining,
    formatViewerCount,
    refreshLives: fetchLives,
  };
};

export default useLiveNotifications;
