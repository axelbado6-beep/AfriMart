import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Package, MessageCircle, CheckCircle, ShoppingBag, Star, TrendingUp, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";
import { useNotifications } from "@/hooks/useNotifications";

export const NotificationBell = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
    });
  }, []);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(userId);

  const getIcon = (type: string) => {
    switch (type) {
      case "new_order":
        return <Package className="w-5 h-5 text-afrimart-orange" />;
      case "order_update":
        return <CheckCircle className="w-5 h-5 text-afrimart-green" />;
      case "new_message":
        return <MessageCircle className="w-5 h-5 text-primary" />;
      case "new_follower":
        return <Star className="w-5 h-5 text-afrimart-gold" />;
      case "sale":
        return <TrendingUp className="w-5 h-5 text-afrimart-green" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getIconBg = (type: string) => {
    switch (type) {
      case "new_order":
        return "bg-afrimart-orange/10";
      case "order_update":
        return "bg-afrimart-green/10";
      case "new_message":
        return "bg-primary/10";
      case "new_follower":
        return "bg-afrimart-gold/10";
      case "sale":
        return "bg-afrimart-green/10";
      default:
        return "bg-muted";
    }
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    setOpen(false);
    
    if (notification.type === "new_order" || notification.type === "order_update") {
      navigate("/orders");
    } else if (notification.type === "new_message") {
      navigate("/messages");
    }
  };

  if (!userId) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative hover:scale-110 hover:bg-afrimart-orange/10 active:scale-95 transition-all duration-200"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-gradient-to-r from-afrimart-orange to-afrimart-gold text-white text-xs rounded-full flex items-center justify-center animate-bounce-in font-bold shadow-lg shadow-afrimart-orange/40">
              {unreadCount > 9 ? "9+" : unreadCount}
              <span className="absolute inset-0 rounded-full bg-afrimart-orange animate-ping-slow opacity-50" />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-96 p-0 rounded-2xl border-2 border-border shadow-2xl overflow-hidden animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-afrimart-orange/10 to-afrimart-gold/10 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-afrimart-orange/20 flex items-center justify-center">
              <Bell className="w-4 h-4 text-afrimart-orange" />
            </div>
            <h3 className="font-display font-bold">Notifications</h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-afrimart-orange text-white text-xs rounded-full font-medium">
                {unreadCount} nouvelles
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs text-muted-foreground hover:text-afrimart-orange"
            >
              Tout marquer lu
            </Button>
          )}
        </div>
        
        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <p className="text-muted-foreground font-medium">Aucune notification</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Vous serez notifié des nouvelles activités
              </p>
            </div>
          ) : (
            notifications.slice(0, 10).map((notification, index) => (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`
                  w-full p-4 flex items-start gap-4 text-left 
                  hover:bg-muted/50 transition-all duration-200
                  border-b border-border last:border-0
                  animate-fade-in
                  ${!notification.is_read ? "bg-primary/5" : ""}
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${getIconBg(notification.type)} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                  {getIcon(notification.type)}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm leading-tight ${!notification.is_read ? "font-semibold text-foreground" : "text-foreground/80"}`}>
                      {notification.title}
                    </p>
                    {!notification.is_read && (
                      <div className="w-2 h-2 rounded-full bg-afrimart-orange flex-shrink-0 mt-1.5 animate-pulse" />
                    )}
                  </div>
                  {notification.message && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/70 mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {new Date(notification.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-border bg-muted/30">
            <Button 
              variant="ghost" 
              className="w-full text-sm text-muted-foreground hover:text-foreground"
              onClick={() => {
                setOpen(false);
                // Could navigate to a full notifications page
              }}
            >
              Voir toutes les notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
