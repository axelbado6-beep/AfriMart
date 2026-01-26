import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Store, Image, Video, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  media_url?: string | null;
  media_type?: string | null;
  product_id?: string | null;
  created_at: string;
  is_read: boolean;
}

interface ProductContext {
  id: string;
  image: string;
  name: string;
}

const Chat = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [otherParty, setOtherParty] = useState<{ name: string; avatar: string | null } | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [productContext, setProductContext] = useState<ProductContext | null>(null);
  const [isBusinessUser, setIsBusinessUser] = useState(false);

  // Get product context from navigation state
  useEffect(() => {
    const state = location.state as { product?: ProductContext } | null;
    if (state?.product) {
      setProductContext(state.product);
    }
  }, [location.state]);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }
      setCurrentUserId(user.id);

      // Check if user is business
      const { data: profile } = await supabase
        .from("profiles")
        .select("user_type")
        .eq("user_id", user.id)
        .single();
      
      setIsBusinessUser(profile?.user_type === "business");
    };
    init();
  }, [navigate]);

  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    const fetchConversation = async () => {
      const { data: convo, error } = await supabase
        .from("conversations")
        .select("*")
        .eq("id", conversationId)
        .single();

      if (error || !convo) {
        toast({
          title: "Erreur",
          description: "Conversation introuvable",
          variant: "destructive",
        });
        navigate("/dashboard");
        return;
      }

      const isClient = convo.client_id === currentUserId;

      if (isClient) {
        const { data: business } = await supabase
          .from("business_profiles")
          .select("business_name, logo_url")
          .eq("id", convo.business_id)
          .single();

        if (business) {
          setOtherParty({ name: business.business_name, avatar: business.logo_url });
        }
      } else {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("user_id", convo.client_id)
          .single();

        if (profile) {
          setOtherParty({ name: profile.full_name || "Client", avatar: profile.avatar_url });
        }
      }

      const { data: messagesData } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      setMessages((messagesData as Message[]) || []);
      setLoading(false);
    };

    fetchConversation();

    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId, navigate, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "La taille maximum est de 10 Mo",
          variant: "destructive",
        });
        return;
      }
      setSelectedMedia(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const clearMedia = () => {
    setSelectedMedia(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedMedia && !productContext) || !currentUserId || !conversationId) return;

    setSending(true);

    let mediaUrl = null;
    let mediaType = null;

    // Upload media if selected
    if (selectedMedia) {
      const fileExt = selectedMedia.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `chat-media/${conversationId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("chat-media")
        .upload(filePath, selectedMedia);

      if (uploadError) {
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer le fichier",
          variant: "destructive",
        });
        setSending(false);
        return;
      }

      const { data: urlData } = supabase.storage
        .from("chat-media")
        .getPublicUrl(filePath);

      mediaUrl = urlData.publicUrl;
      mediaType = selectedMedia.type.startsWith("video/") ? "video" : "image";
    }

    // Build message content
    let content = newMessage.trim();
    if (productContext && !messages.some(m => m.product_id === productContext.id)) {
      content = content || `Je suis intéressé par : ${productContext.name}`;
    }

    const messageData: {
      conversation_id: string;
      sender_id: string;
      content: string;
      media_url?: string;
      media_type?: string;
      product_id?: string;
    } = {
      conversation_id: conversationId,
      sender_id: currentUserId,
      content,
    };

    if (mediaUrl) {
      messageData.media_url = mediaUrl;
      messageData.media_type = mediaType || undefined;
    }

    if (productContext && !messages.some(m => m.product_id === productContext.id)) {
      messageData.product_id = productContext.id;
    }

    const { error } = await supabase.from("messages").insert(messageData);

    if (error) {
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
    } else {
      setNewMessage("");
      clearMedia();
      if (productContext) setProductContext(null);
    }
    setSending(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/messages")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
            {otherParty?.avatar ? (
              <img src={otherParty.avatar} alt="" className="w-full h-full object-cover" />
            ) : (
              <Store className="w-5 h-5 text-primary" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h1 className="font-display font-bold truncate">{otherParty?.name}</h1>
            <p className="text-xs text-muted-foreground">En ligne</p>
          </div>
        </div>
      </div>

      {/* Product Context Banner */}
      {productContext && (
        <div className="bg-muted/50 border-b border-border p-3">
          <div className="container mx-auto flex items-center gap-3">
            <img 
              src={productContext.image} 
              alt={productContext.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Concernant :</p>
              <p className="font-medium truncate">{productContext.name}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setProductContext(null)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageCircleIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Commencez la conversation</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              isOwn={message.sender_id === currentUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Media Preview */}
      {mediaPreview && (
        <div className="bg-card border-t border-border p-3">
          <div className="container mx-auto flex items-center gap-3">
            <div className="relative">
              {selectedMedia?.type.startsWith("video/") ? (
                <video src={mediaPreview} className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <img src={mediaPreview} alt="" className="w-16 h-16 rounded-lg object-cover" />
              )}
              <Button 
                variant="destructive" 
                size="icon" 
                className="absolute -top-2 -right-2 w-6 h-6"
                onClick={clearMedia}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
            <span className="text-sm text-muted-foreground">{selectedMedia?.name}</span>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="sticky bottom-0 bg-card border-t border-border p-4">
        <div className="container mx-auto flex gap-2 items-center">
          {/* Media buttons - only for business users */}
          {isBusinessUser && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,video/*"
                className="hidden"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={sending}
              >
                <Image className="w-5 h-5 text-muted-foreground" />
              </Button>
            </>
          )}
          
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Écrivez votre message..."
            className="flex-1"
            disabled={sending}
          />
          <Button 
            onClick={handleSend} 
            disabled={(!newMessage.trim() && !selectedMedia && !productContext) || sending}
            className="btn-client"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const MessageBubble = ({ message, isOwn }: { message: Message; isOwn: boolean }) => {
  const [productDetails, setProductDetails] = useState<{ name: string; image: string; price: number; currency: string } | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (message.product_id) {
        const { data } = await supabase
          .from("products")
          .select("name, images, price, currency")
          .eq("id", message.product_id)
          .single();
        
        if (data) {
          setProductDetails({
            name: data.name,
            image: data.images?.[0] || "/placeholder.svg",
            price: data.price,
            currency: data.currency
          });
        }
      }
    };
    fetchProduct();
  }, [message.product_id]);

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] md:max-w-[60%] rounded-2xl px-4 py-2 ${
          isOwn
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-muted text-foreground rounded-bl-md"
        }`}
      >
        {/* Product reference card */}
        {message.product_id && productDetails && (
          <div className="mb-2 p-2 rounded-lg bg-background/20 border border-border/30">
            <div className="flex gap-2 items-start">
              <img 
                src={productDetails.image} 
                alt={productDetails.name}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className={`text-xs ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  Produit référencé
                </p>
                <p className="font-medium text-sm truncate">{productDetails.name}</p>
                <p className={`text-sm font-bold ${isOwn ? "" : "text-afrimart-orange"}`}>
                  {productDetails.price.toLocaleString()} {productDetails.currency}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Media content */}
        {message.media_url && (
          <div className="mb-2">
            {message.media_type === "video" ? (
              <video 
                src={message.media_url} 
                controls 
                className="rounded-lg max-w-full"
              />
            ) : (
              <img 
                src={message.media_url} 
                alt="" 
                className="rounded-lg max-w-full cursor-pointer"
                onClick={() => window.open(message.media_url!, "_blank")}
              />
            )}
          </div>
        )}
        
        {message.content && <p className="break-words">{message.content}</p>}
        
        <p className={`text-xs mt-1 ${isOwn ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {new Date(message.created_at).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
};

const MessageCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

export default Chat;
