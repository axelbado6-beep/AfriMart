import { useState } from "react";
import { Plus, Store, Camera } from "lucide-react";
import { cn } from "@/lib/utils";

interface StoryProfileRingProps {
  imageUrl?: string | null;
  name: string;
  hasActiveStory?: boolean;
  isOwner?: boolean;
  onAddStoryClick?: () => void;
  onViewStoryClick?: () => void;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-14 h-14",
  md: "w-20 h-20",
  lg: "w-28 h-28",
  xl: "w-36 h-36",
};

const innerSizeClasses = {
  sm: "w-12 h-12",
  md: "w-[4.5rem] h-[4.5rem]",
  lg: "w-24 h-24",
  xl: "w-32 h-32",
};

const iconSizeClasses = {
  sm: "w-5 h-5",
  md: "w-8 h-8",
  lg: "w-10 h-10",
  xl: "w-12 h-12",
};

const addButtonSizeClasses = {
  sm: "w-5 h-5",
  md: "w-7 h-7",
  lg: "w-9 h-9",
  xl: "w-11 h-11",
};

const addButtonPositionClasses = {
  sm: "-bottom-0.5 -right-0.5",
  md: "-bottom-1 -right-1",
  lg: "-bottom-1.5 -right-1.5",
  xl: "-bottom-2 -right-2",
};

export function StoryProfileRing({
  imageUrl,
  name,
  hasActiveStory = false,
  isOwner = false,
  onAddStoryClick,
  onViewStoryClick,
  size = "lg",
  className,
}: StoryProfileRingProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (hasActiveStory && onViewStoryClick) {
      onViewStoryClick();
    } else if (isOwner && onAddStoryClick) {
      onAddStoryClick();
    }
  };

  return (
    <div
      className={cn("relative group cursor-pointer", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Outer ring with gradient animation */}
      <div
        className={cn(
          sizeClasses[size],
          "rounded-full p-[3px] transition-all duration-500",
          hasActiveStory
            ? "bg-gradient-to-br from-afrimart-orange via-afrimart-gold to-afrimart-green story-ring-pulse"
            : isOwner
            ? "bg-gradient-to-br from-muted-foreground/30 to-muted-foreground/20"
            : "bg-gradient-to-br from-border to-border/50",
          isHovered && "scale-105 shadow-lg",
          hasActiveStory && isHovered && "shadow-xl shadow-afrimart-orange/30"
        )}
      >
        {/* Inner white ring */}
        <div
          className={cn(
            innerSizeClasses[size],
            "rounded-full bg-background p-[2px] mx-auto transition-transform duration-300",
            isHovered && "scale-[0.98]"
          )}
        >
          {/* Profile image or placeholder */}
          <div
            className={cn(
              "w-full h-full rounded-full overflow-hidden bg-muted flex items-center justify-center",
              "transition-all duration-300",
              isHovered && "brightness-90"
            )}
          >
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <Store className={cn(iconSizeClasses[size], "text-muted-foreground")} />
            )}

            {/* Hover overlay for viewing story */}
            {hasActiveStory && (
              <div
                className={cn(
                  "absolute inset-0 rounded-full bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                )}
              >
                <span className="text-white text-xs font-medium">Voir</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add story button (only for owners) */}
      {isOwner && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddStoryClick?.();
          }}
          className={cn(
            addButtonSizeClasses[size],
            addButtonPositionClasses[size],
            "absolute rounded-full bg-gradient-to-br from-afrimart-orange to-afrimart-gold",
            "flex items-center justify-center text-white shadow-lg",
            "border-2 border-background",
            "transition-all duration-300",
            "hover:scale-110 hover:shadow-xl hover:shadow-afrimart-orange/40",
            "active:scale-95",
            "z-10"
          )}
        >
          {hasActiveStory ? (
            <Camera className="w-3 h-3" />
          ) : (
            <Plus className="w-3 h-3" />
          )}
        </button>
      )}

      {/* Pulsing glow effect for active stories */}
      {hasActiveStory && (
        <div
          className={cn(
            sizeClasses[size],
            "absolute inset-0 rounded-full",
            "bg-gradient-to-br from-afrimart-orange/40 via-afrimart-gold/40 to-afrimart-green/40",
            "animate-ping-slow opacity-50 -z-10"
          )}
        />
      )}

      {/* Live indicator */}
      {hasActiveStory && (
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gradient-to-r from-afrimart-orange to-afrimart-gold text-white text-[10px] font-bold rounded-full animate-pulse">
          STORY
        </div>
      )}
    </div>
  );
}

export default StoryProfileRing;
