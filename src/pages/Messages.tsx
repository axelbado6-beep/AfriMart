import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageCircle, Store, User } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Conversation = Tables<"conversations">;

interface ConversationWithDetails {
  id: string;
  otherParty: {
    name: string;
    avatar: string | null;
    type: "business" | "client";
  };
  lastMessage?: string;
  lastMessageAt: string;
  unreadCount: number;
}

const Messages = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [userType, setUserType] = useState<"client" | "business" | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setCurrentUserId(user.id);

      // Get user type
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("user_id", user.id)
        .single();

      if (profile) {
        setUserType(profile.user_type);
      }
    };
    init();
  }, [navigate]);

  useEffect(() => {
    if (!currentUserId || !userType) return;

    const fetchConversations = async () => {
      let query;
      
      if (userType === "client") {
        query = supabase
          .from("conversations")
          .select("*")
          .eq("client_id", currentUserId);
      } else {
        // For business, we need to find conversations where user owns the business
        const { data: businessProfile } = await supabase
          .from("business_profiles")
          .select("id")
          .eq("user_id", currentUserId)
          .single();

        if (!businessProfile) {
          setLoading(false);
          return;
        }

        query = supabase
          .from("conversations")
          .select("*")
          .eq("business_id", businessProfile.id);
      }

      const { data: convos } = await query.order("last_message_at", { ascending: false });

      if (!convos) {
        setLoading(false);
        return;
      }

      // Fetch details for each conversation
      const conversationsWithDetails: ConversationWithDetails[] = await Promise.all(
        convos.map(async (convo) => {
          let otherParty: ConversationWithDetails["otherParty"];

          if (userType === "client") {
            // Fetch business info
            const { data: business } = await supabase
              .from("business_profiles")
              .select("business_name, logo_url")
              .eq("id", convo.business_id)
              .single();

            otherParty = {
              name: business?.business_name || "Entreprise",
              avatar: business?.logo_url || null,
              type: "business",
            };
          } else {
            // Fetch client info
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name, avatar_url")
              .eq("user_id", convo.client_id)
              .single();

            otherParty = {
              name: profile?.full_name || "Client",
              avatar: profile?.avatar_url || null,
              type: "client",
            };
          }

          // Fetch last message
          const { data: lastMsg } = await supabase
            .from("messages")
            .select("content, created_at")
            .eq("conversation_id", convo.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          // Count unread messages
          const { count } = await supabase
            .from("messages")
            .select("*", { count: "exact", head: true })
            .eq("conversation_id", convo.id)
            .neq("sender_id", currentUserId)
            .eq("is_read", false);

          return {
            id: convo.id,
            otherParty,
            lastMessage: lastMsg?.content,
            lastMessageAt: lastMsg?.created_at || convo.created_at,
            unreadCount: count || 0,
          };
        })
      );

      setConversations(conversationsWithDetails);
      setLoading(false);
    };

    fetchConversations();

    // Subscribe to new messages
    const channel = supabase
      .channel("conversations-updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUserId, userType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-display font-bold">Messages</h1>
        </div>
      </div>

      {/* Conversations List */}
      <div className="container mx-auto">
        {conversations.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-display font-semibold mb-2">
              Aucune conversation
            </h2>
            <p className="text-muted-foreground mb-4">
              {userType === "client" 
                ? "Explorez les entreprises et contactez-les pour démarrer une conversation"
                : "Vos clients vous contacteront bientôt"}
            </p>
            {userType === "client" && (
              <Button className="btn-client" onClick={() => navigate("/catalog")}>
                Explorer les entreprises
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {conversations.map((convo) => (
              <ConversationItem 
                key={convo.id} 
                conversation={convo}
                onClick={() => navigate(`/chat/${convo.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ConversationItem = ({ 
  conversation, 
  onClick 
}: { 
  conversation: ConversationWithDetails;
  onClick: () => void;
}) => {
  const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `${minutes}min`;
    if (hours < 24) return `${hours}h`;
    return `${days}j`;
  };

  return (
    <button
      onClick={onClick}
      className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors text-left"
    >
      {/* Avatar */}
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
          {conversation.otherParty.avatar ? (
            <img 
              src={conversation.otherParty.avatar} 
              alt="" 
              className="w-full h-full object-cover"
            />
          ) : conversation.otherParty.type === "business" ? (
            <Store className="w-6 h-6 text-primary" />
          ) : (
            <User className="w-6 h-6 text-primary" />
          )}
        </div>
        {conversation.unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-afrimart-orange text-white text-xs rounded-full flex items-center justify-center font-bold">
            {conversation.unreadCount > 9 ? "9+" : conversation.unreadCount}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className={`font-semibold truncate ${conversation.unreadCount > 0 ? "text-foreground" : ""}`}>
            {conversation.otherParty.name}
          </h3>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {timeAgo(conversation.lastMessageAt)}
          </span>
        </div>
        <p className={`text-sm truncate ${conversation.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
          {conversation.lastMessage || "Nouvelle conversation"}
        </p>
      </div>
    </button>
  );
};

export default Messages;
