import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Store, 
  Pause, 
  Play,
  Volume2,
  VolumeX
} from "lucide-react";

interface Story {
  id: string;
  media_url: string;
  thumbnail_url: string | null;
  media_type: string;
  created_at: string;
  expires_at: string | null;
  business_id: string;
}

interface Business {
  id: string;
  business_name: string;
  logo_url: string | null;
}

interface StoryViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  business: Business;
  stories: Story[];
  initialIndex?: number;
}

const STORY_DURATION = 5000; // 5 seconds per story

const StoryViewer = ({ 
  open, 
  onOpenChange, 
  business, 
  stories,
  initialIndex = 0
}: StoryViewerProps) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const currentStory = stories[currentIndex];
  const isVideo = currentStory?.media_url?.includes(".mp4") || 
                  currentStory?.media_url?.includes(".webm") ||
                  currentStory?.media_url?.includes(".mov");

  useEffect(() => {
    if (!open) {
      setCurrentIndex(initialIndex);
      setProgress(0);
      return;
    }

    startProgress();
    return () => stopProgress();
  }, [open, currentIndex]);

  useEffect(() => {
    if (isPaused) {
      stopProgress();
    } else if (open) {
      startProgress();
    }
  }, [isPaused]);

  const startProgress = () => {
    stopProgress();
    
    const startTime = Date.now();
    const duration = isVideo && videoRef.current 
      ? videoRef.current.duration * 1000 
      : STORY_DURATION;

    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / duration) * 100;
      
      if (newProgress >= 100) {
        goToNext();
      } else {
        setProgress(newProgress);
      }
    }, 50);
  };

  const stopProgress = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onOpenChange(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const handleTap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const third = rect.width / 3;

    if (x < third) {
      goToPrevious();
    } else if (x > third * 2) {
      goToNext();
    } else {
      setIsPaused(!isPaused);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return "À l'instant";
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    return `Il y a ${Math.floor(diffHours / 24)}j`;
  };

  const handleBusinessClick = () => {
    onOpenChange(false);
    navigate(`/business/${business.id}`);
  };

  if (!currentStory) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full h-[90vh] max-h-[800px] p-0 bg-black border-none overflow-hidden">
        <div className="relative w-full h-full flex flex-col">
          {/* Progress Bars */}
          <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
            {stories.map((_, idx) => (
              <div 
                key={idx} 
                className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
              >
                <div 
                  className="h-full bg-white transition-all duration-100"
                  style={{ 
                    width: idx < currentIndex 
                      ? "100%" 
                      : idx === currentIndex 
                        ? `${progress}%` 
                        : "0%" 
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-6 left-0 right-0 z-20 flex items-center justify-between px-4">
            <button 
              onClick={handleBusinessClick}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                {business.logo_url ? (
                  <img 
                    src={business.logo_url} 
                    alt={business.business_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="text-white text-left">
                <p className="font-semibold text-sm group-hover:underline">
                  {business.business_name}
                </p>
                <p className="text-xs text-white/70">
                  {formatTimeAgo(currentStory.created_at)}
                </p>
              </div>
            </button>

            <div className="flex items-center gap-2">
              {isVideo && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? (
                  <Play className="w-5 h-5" />
                ) : (
                  <Pause className="w-5 h-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => onOpenChange(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Story Content */}
          <div 
            className="flex-1 flex items-center justify-center cursor-pointer"
            onClick={handleTap}
          >
            {isVideo ? (
              <video
                ref={videoRef}
                src={currentStory.media_url}
                className="max-w-full max-h-full object-contain"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onLoadedMetadata={() => {
                  if (!isPaused) startProgress();
                }}
              />
            ) : (
              <img
                src={currentStory.media_url}
                alt="Story"
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>

          {/* Navigation Arrows (visible on hover) */}
          {currentIndex > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}
          {currentIndex < stories.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/30 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoryViewer;
