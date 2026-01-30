import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  X, 
  Type, 
  Sliders, 
  Sparkles, 
  Music, 
  Scissors,
  RotateCcw,
  Play,
  Pause,
  Check,
  Smile,
  Wand2,
  Pencil,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  FlipHorizontal
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import EditorStickers, { Sticker } from "./EditorStickers";
import EditorEffects, { getEffectCSS } from "./EditorEffects";
import EditorDrawing from "./EditorDrawing";
import EditorMusic from "./EditorMusic";

interface MediaEditorProps {
  file: File;
  onSave: (editedFile: Blob, thumbnail: Blob | null) => void;
  onCancel: () => void;
}

interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontFamily: string;
  animation: string;
}

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  hueRotate: number;
}

const FILTERS = [
  { name: "Original", settings: { brightness: 100, contrast: 100, saturation: 100, blur: 0, hueRotate: 0 } },
  { name: "Vivid", settings: { brightness: 110, contrast: 120, saturation: 130, blur: 0, hueRotate: 0 } },
  { name: "Vintage", settings: { brightness: 90, contrast: 110, saturation: 70, blur: 0, hueRotate: 20 } },
  { name: "Noir", settings: { brightness: 100, contrast: 130, saturation: 0, blur: 0, hueRotate: 0 } },
  { name: "Warm", settings: { brightness: 105, contrast: 105, saturation: 110, blur: 0, hueRotate: -10 } },
  { name: "Cool", settings: { brightness: 100, contrast: 105, saturation: 90, blur: 0, hueRotate: 180 } },
  { name: "Dramatic", settings: { brightness: 90, contrast: 150, saturation: 80, blur: 0, hueRotate: 0 } },
  { name: "Soft", settings: { brightness: 110, contrast: 90, saturation: 90, blur: 1, hueRotate: 0 } },
  { name: "Sunset", settings: { brightness: 105, contrast: 110, saturation: 120, blur: 0, hueRotate: -20 } },
  { name: "Forest", settings: { brightness: 95, contrast: 105, saturation: 90, blur: 0, hueRotate: 60 } },
];

const FONTS = [
  "Montserrat",
  "Poppins",
  "Georgia",
  "Impact",
  "Arial Black",
  "Courier New",
];

const TEXT_ANIMATIONS = [
  { id: "none", name: "Aucune" },
  { id: "bounce", name: "Rebond" },
  { id: "pulse", name: "Pulsation" },
  { id: "shake", name: "Tremblement" },
  { id: "glow", name: "Brillance" },
];

const MediaEditor = ({ file, onSave, onCancel }: MediaEditorProps) => {
  const isVideo = file.type.startsWith("video/");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  const [activeTab, setActiveTab] = useState("filters");
  const [showPanel, setShowPanel] = useState(true);
  
  // Transform states
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hueRotate: 0,
  });
  
  // Effect state
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  
  // Text overlays
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [newTextInput, setNewTextInput] = useState("");
  
  // Stickers
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  
  // Drawing
  const [drawingDataUrl, setDrawingDataUrl] = useState<string | null>(null);
  
  // Music
  const [selectedMusic, setSelectedMusic] = useState<string | null>(null);
  const [musicVolume, setMusicVolume] = useState(70);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setMediaUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      video.onloadedmetadata = () => {
        setDuration(video.duration);
        setTrimEnd(100);
      };
      video.ontimeupdate = () => {
        setCurrentTime(video.currentTime);
      };
    }
  }, [mediaUrl, isVideo]);

  const getFilterStyle = () => {
    const baseFilter = `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturation}%) 
      blur(${filters.blur}px) 
      hue-rotate(${filters.hueRotate}deg)
    `;
    const effectFilter = getEffectCSS(selectedEffect);
    return effectFilter ? `${baseFilter} ${effectFilter}` : baseFilter;
  };

  const getTransformStyle = () => {
    return `scale(${zoom / 100}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1})`;
  };

  const applyFilter = (filterPreset: typeof FILTERS[0]) => {
    setFilters(filterPreset.settings);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const addTextOverlay = () => {
    if (!newTextInput.trim()) return;
    
    const newText: TextOverlay = {
      id: Date.now().toString(),
      text: newTextInput,
      x: 50,
      y: 50,
      fontSize: 32,
      color: "#ffffff",
      fontFamily: "Montserrat",
      animation: "none",
    };
    setTextOverlays([...textOverlays, newText]);
    setNewTextInput("");
    setSelectedText(newText.id);
  };

  const updateTextOverlay = (id: string, updates: Partial<TextOverlay>) => {
    setTextOverlays(textOverlays.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const removeTextOverlay = (id: string) => {
    setTextOverlays(textOverlays.filter(t => t.id !== id));
    if (selectedText === id) setSelectedText(null);
  };

  const addSticker = (stickerData: Omit<Sticker, "id" | "x" | "y" | "scale" | "rotation">) => {
    const newSticker: Sticker = {
      ...stickerData,
      id: Date.now().toString(),
      x: 50,
      y: 30,
      scale: 1,
      rotation: 0,
    };
    setStickers([...stickers, newSticker]);
    setSelectedSticker(newSticker.id);
  };

  const updateSticker = (id: string, updates: Partial<Sticker>) => {
    setStickers(stickers.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  };

  const removeSticker = (id: string) => {
    setStickers(stickers.filter(s => s.id !== id));
    if (selectedSticker === id) setSelectedSticker(null);
  };

  const handleSave = async () => {
    // For photos, render to canvas and export
    if (!isVideo && imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = imageRef.current;
      
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      if (ctx) {
        ctx.save();
        
        // Apply transform
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(flipH ? -1 : 1, 1);
        ctx.scale(zoom / 100, zoom / 100);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        
        // Apply filters
        ctx.filter = getFilterStyle();
        ctx.drawImage(img, 0, 0);
        
        ctx.restore();
        
        // Reset filter for overlays
        ctx.filter = "none";
        
        // Draw stickers
        stickers.forEach(sticker => {
          if (sticker.type === "emoji") {
            const fontSize = 60 * sticker.scale;
            ctx.font = `${fontSize}px Arial`;
            ctx.textAlign = "center";
            ctx.save();
            ctx.translate((sticker.x / 100) * canvas.width, (sticker.y / 100) * canvas.height);
            ctx.rotate((sticker.rotation * Math.PI) / 180);
            ctx.fillText(sticker.content, 0, fontSize / 3);
            ctx.restore();
          }
        });
        
        // Draw text overlays
        textOverlays.forEach(text => {
          ctx.font = `${text.fontSize * (canvas.width / 400)}px ${text.fontFamily}`;
          ctx.fillStyle = text.color;
          ctx.textAlign = "center";
          ctx.shadowColor = "rgba(0,0,0,0.8)";
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          ctx.fillText(
            text.text, 
            (text.x / 100) * canvas.width, 
            (text.y / 100) * canvas.height
          );
        });
        
        // Draw drawing layer if exists
        if (drawingDataUrl) {
          const drawingImg = new Image();
          drawingImg.onload = () => {
            ctx.drawImage(drawingImg, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
              if (blob) {
                onSave(blob, blob);
              }
            }, "image/jpeg", 0.95);
          };
          drawingImg.src = drawingDataUrl;
          return;
        }
        
        canvas.toBlob((blob) => {
          if (blob) {
            onSave(blob, blob);
          }
        }, "image/jpeg", 0.95);
      }
    } else if (isVideo) {
      const blob = new Blob([file], { type: file.type });
      
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.filter = getFilterStyle();
          ctx.drawImage(video, 0, 0);
          canvas.toBlob((thumbnail) => {
            onSave(blob, thumbnail);
          }, "image/jpeg", 0.9);
          return;
        }
      }
      onSave(blob, null);
    }
  };

  const selectedTextOverlay = textOverlays.find(t => t.id === selectedText);
  const selectedStickerData = stickers.find(s => s.id === selectedSticker);

  const getTextAnimationClass = (animId: string) => {
    switch (animId) {
      case "bounce": return "animate-bounce";
      case "pulse": return "animate-pulse";
      case "shake": return "animate-wiggle";
      case "glow": return "animate-pulse-slow";
      default: return "";
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between p-3 md:p-4 border-b border-border bg-card/80 backdrop-blur-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancel}
          className="hover:scale-110 active:scale-95 transition-transform"
        >
          <X className="w-5 h-5" />
        </Button>
        <h2 className="font-display font-bold text-lg">
          Éditeur {isVideo ? "Vidéo" : "Photo"}
        </h2>
        <Button 
          onClick={handleSave} 
          className="btn-business gap-2 hover:scale-105 active:scale-95 transition-transform"
        >
          <Check className="w-4 h-4" />
          <span className="hidden sm:inline">Terminer</span>
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Preview Area */}
        <div 
          ref={containerRef}
          className="flex-1 relative flex items-center justify-center bg-black/95 overflow-hidden"
        >
          {/* Quick Transform Controls */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <Button
              variant="secondary"
              size="icon"
              className="w-9 h-9 bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm transition-all hover:scale-110"
              onClick={() => setZoom(z => Math.min(200, z + 10))}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="w-9 h-9 bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm transition-all hover:scale-110"
              onClick={() => setZoom(z => Math.max(50, z - 10))}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="w-9 h-9 bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm transition-all hover:scale-110"
              onClick={() => setRotation(r => (r + 90) % 360)}
            >
              <RotateCw className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className={`w-9 h-9 bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm transition-all hover:scale-110 ${flipH ? "ring-2 ring-primary" : ""}`}
              onClick={() => setFlipH(!flipH)}
            >
              <FlipHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Toggle Panel Button (Mobile) */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4 z-10 md:hidden w-9 h-9 bg-black/50 hover:bg-black/70 text-white border-none backdrop-blur-sm"
            onClick={() => setShowPanel(!showPanel)}
          >
            {showPanel ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>

          <div 
            className="relative max-w-full max-h-full transition-transform duration-300"
            style={{ transform: getTransformStyle() }}
          >
            {isVideo ? (
              <video
                ref={videoRef}
                src={mediaUrl}
                className="max-w-full max-h-[55vh] md:max-h-[70vh] rounded-lg shadow-2xl"
                style={{ filter: getFilterStyle() }}
                onClick={togglePlay}
                playsInline
              />
            ) : (
              <img
                ref={imageRef}
                src={mediaUrl}
                alt="Editing"
                className="max-w-full max-h-[55vh] md:max-h-[70vh] object-contain rounded-lg shadow-2xl"
                style={{ filter: getFilterStyle() }}
                crossOrigin="anonymous"
              />
            )}
            
            {/* Stickers */}
            {stickers.map(sticker => (
              <div
                key={sticker.id}
                className={`absolute cursor-move select-none transition-all hover:scale-110 ${
                  selectedSticker === sticker.id ? "ring-2 ring-primary ring-offset-2 ring-offset-black" : ""
                }`}
                style={{
                  left: `${sticker.x}%`,
                  top: `${sticker.y}%`,
                  transform: `translate(-50%, -50%) scale(${sticker.scale}) rotate(${sticker.rotation}deg)`,
                  fontSize: sticker.type === "emoji" ? "48px" : "32px",
                }}
                onClick={() => setSelectedSticker(sticker.id)}
              >
                {sticker.type === "emoji" && sticker.content}
              </div>
            ))}

            {/* Text Overlays */}
            {textOverlays.map(text => (
              <div
                key={text.id}
                className={`absolute cursor-move select-none transition-all ${
                  selectedText === text.id ? "ring-2 ring-primary ring-offset-2 ring-offset-black" : ""
                } ${getTextAnimationClass(text.animation)}`}
                style={{
                  left: `${text.x}%`,
                  top: `${text.y}%`,
                  transform: "translate(-50%, -50%)",
                  fontSize: `${text.fontSize}px`,
                  color: text.color,
                  fontFamily: text.fontFamily,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)",
                }}
                onClick={() => setSelectedText(text.id)}
              >
                {text.text}
              </div>
            ))}

            {/* Video Controls */}
            {isVideo && (
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4 animate-slide-up">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/50 text-white hover:bg-black/70 hover:scale-110 transition-all"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <div className="flex-1 bg-white/20 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-100"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <span className="text-white text-sm font-medium">
                  {Math.floor(currentTime)}s / {Math.floor(duration)}s
                </span>
              </div>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Panel */}
        <div className={`w-full md:w-96 border-t md:border-t-0 md:border-l border-border bg-card transition-all duration-300 ${
          showPanel ? "max-h-[45vh] md:max-h-full" : "max-h-0 md:max-h-full overflow-hidden md:overflow-visible"
        }`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="w-full grid grid-cols-6 rounded-none border-b border-border bg-transparent p-0 h-auto">
              {[
                { value: "filters", icon: Sparkles, label: "Filtres" },
                { value: "adjust", icon: Sliders, label: "Ajuster" },
                { value: "effects", icon: Wand2, label: "Effets" },
                { value: "stickers", icon: Smile, label: "Stickers" },
                { value: "text", icon: Type, label: "Texte" },
                { value: "draw", icon: Pencil, label: "Dessin" },
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value} 
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 transition-all data-[state=active]:bg-primary/5"
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden lg:inline ml-2 text-xs">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <ScrollArea className="flex-1">
              {/* Filters Tab */}
              <TabsContent value="filters" className="p-4 m-0 animate-fade-in">
                <div className="grid grid-cols-4 gap-2">
                  {FILTERS.map((filter, i) => (
                    <button
                      key={filter.name}
                      onClick={() => applyFilter(filter)}
                      className={`p-2 rounded-xl border transition-all duration-300 hover:scale-105 active:scale-95 ${
                        JSON.stringify(filters) === JSON.stringify(filter.settings)
                          ? "border-primary bg-primary/10 scale-105"
                          : "border-border hover:border-primary/50"
                      }`}
                      style={{ animationDelay: `${i * 40}ms` }}
                    >
                      <div 
                        className="aspect-square rounded-lg mb-1 overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))`,
                          filter: `brightness(${filter.settings.brightness}%) contrast(${filter.settings.contrast}%) saturate(${filter.settings.saturation}%) hue-rotate(${filter.settings.hueRotate}deg)`
                        }}
                      />
                      <span className="text-[10px] font-medium">{filter.name}</span>
                    </button>
                  ))}
                </div>
              </TabsContent>

              {/* Adjust Tab */}
              <TabsContent value="adjust" className="p-4 m-0 space-y-5 animate-fade-in">
                {[
                  { label: "Luminosité", key: "brightness", min: 50, max: 150, unit: "%" },
                  { label: "Contraste", key: "contrast", min: 50, max: 150, unit: "%" },
                  { label: "Saturation", key: "saturation", min: 0, max: 200, unit: "%" },
                  { label: "Teinte", key: "hueRotate", min: 0, max: 360, unit: "°" },
                  { label: "Flou", key: "blur", min: 0, max: 10, unit: "px" },
                ].map((item, i) => (
                  <div key={item.key} className="space-y-2" style={{ animationDelay: `${i * 50}ms` }}>
                    <div className="flex justify-between">
                      <Label>{item.label}</Label>
                      <span className="text-sm text-muted-foreground font-medium">
                        {filters[item.key as keyof FilterSettings]}{item.unit}
                      </span>
                    </div>
                    <Slider
                      value={[filters[item.key as keyof FilterSettings]]}
                      onValueChange={([v]) => setFilters({...filters, [item.key]: v})}
                      min={item.min}
                      max={item.max}
                      step={1}
                      className="transition-all"
                    />
                  </div>
                ))}

                <Button 
                  variant="outline" 
                  className="w-full hover:scale-[1.02] active:scale-[0.98] transition-transform"
                  onClick={() => setFilters({
                    brightness: 100,
                    contrast: 100,
                    saturation: 100,
                    blur: 0,
                    hueRotate: 0,
                  })}
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Réinitialiser
                </Button>
              </TabsContent>

              {/* Effects Tab */}
              <TabsContent value="effects" className="p-4 m-0">
                <EditorEffects 
                  selectedEffect={selectedEffect}
                  onSelectEffect={setSelectedEffect}
                />
              </TabsContent>

              {/* Stickers Tab */}
              <TabsContent value="stickers" className="p-4 m-0">
                <EditorStickers onAddSticker={addSticker} />
                
                {selectedStickerData && (
                  <div className="mt-4 p-4 bg-muted rounded-xl space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center">
                      <Label>Modifier le sticker</Label>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeSticker(selectedStickerData.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Taille</Label>
                      <Slider
                        value={[selectedStickerData.scale * 100]}
                        onValueChange={([v]) => updateSticker(selectedStickerData.id, { scale: v / 100 })}
                        min={50}
                        max={200}
                        step={5}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Position X</Label>
                        <Slider
                          value={[selectedStickerData.x]}
                          onValueChange={([v]) => updateSticker(selectedStickerData.id, { x: v })}
                          min={0}
                          max={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Position Y</Label>
                        <Slider
                          value={[selectedStickerData.y]}
                          onValueChange={([v]) => updateSticker(selectedStickerData.id, { y: v })}
                          min={0}
                          max={100}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Rotation</Label>
                      <Slider
                        value={[selectedStickerData.rotation]}
                        onValueChange={([v]) => updateSticker(selectedStickerData.id, { rotation: v })}
                        min={-180}
                        max={180}
                        step={5}
                      />
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Text Tab */}
              <TabsContent value="text" className="p-4 m-0 space-y-4 animate-fade-in">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ajouter du texte..."
                    value={newTextInput}
                    onChange={(e) => setNewTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTextOverlay()}
                    className="transition-all focus:scale-[1.02]"
                  />
                  <Button 
                    onClick={addTextOverlay} 
                    size="icon"
                    className="hover:scale-110 active:scale-95 transition-transform"
                  >
                    <Type className="w-4 h-4" />
                  </Button>
                </div>

                {selectedTextOverlay && (
                  <div className="space-y-4 p-4 bg-muted rounded-xl animate-fade-in">
                    <div className="flex justify-between items-center">
                      <Label>Éditer le texte</Label>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => removeTextOverlay(selectedTextOverlay.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <Input
                      value={selectedTextOverlay.text}
                      onChange={(e) => updateTextOverlay(selectedTextOverlay.id, { text: e.target.value })}
                    />

                    <div className="space-y-2">
                      <Label>Taille</Label>
                      <Slider
                        value={[selectedTextOverlay.fontSize]}
                        onValueChange={([v]) => updateTextOverlay(selectedTextOverlay.id, { fontSize: v })}
                        min={16}
                        max={80}
                        step={2}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <Label>Position X</Label>
                        <Slider
                          value={[selectedTextOverlay.x]}
                          onValueChange={([v]) => updateTextOverlay(selectedTextOverlay.id, { x: v })}
                          min={0}
                          max={100}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Position Y</Label>
                        <Slider
                          value={[selectedTextOverlay.y]}
                          onValueChange={([v]) => updateTextOverlay(selectedTextOverlay.id, { y: v })}
                          min={0}
                          max={100}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Couleur</Label>
                      <div className="flex flex-wrap gap-2">
                        {["#ffffff", "#000000", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"].map(color => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-125 ${
                              selectedTextOverlay.color === color 
                                ? "border-primary ring-2 ring-primary/50 scale-110" 
                                : "border-transparent hover:border-primary/50"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => updateTextOverlay(selectedTextOverlay.id, { color })}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Police</Label>
                      <select
                        className="w-full p-2 bg-background border border-border rounded-lg transition-all focus:ring-2 focus:ring-primary"
                        value={selectedTextOverlay.fontFamily}
                        onChange={(e) => updateTextOverlay(selectedTextOverlay.id, { fontFamily: e.target.value })}
                      >
                        {FONTS.map(font => (
                          <option key={font} value={font} style={{ fontFamily: font }}>
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Animation</Label>
                      <div className="flex flex-wrap gap-2">
                        {TEXT_ANIMATIONS.map(anim => (
                          <button
                            key={anim.id}
                            onClick={() => updateTextOverlay(selectedTextOverlay.id, { animation: anim.id })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 ${
                              selectedTextOverlay.animation === anim.id
                                ? "bg-primary text-primary-foreground"
                                : "bg-background border border-border hover:border-primary"
                            }`}
                          >
                            {anim.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {textOverlays.length > 0 && (
                  <div className="space-y-2">
                    <Label>Textes ajoutés</Label>
                    {textOverlays.map((text, i) => (
                      <div 
                        key={text.id}
                        className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                          selectedText === text.id 
                            ? "border-primary bg-primary/10" 
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedText(text.id)}
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        <span style={{ fontFamily: text.fontFamily, color: text.color }}>
                          {text.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Drawing Tab */}
              <TabsContent value="draw" className="p-4 m-0">
                <EditorDrawing 
                  canvasWidth={400}
                  canvasHeight={600}
                  onDrawingChange={setDrawingDataUrl}
                />
              </TabsContent>

              {/* Video Trim Tab - Only for videos */}
              {isVideo && (
                <TabsContent value="trim" className="p-4 m-0 space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label>Découper la vidéo</Label>
                    <p className="text-sm text-muted-foreground">
                      Sélectionnez la portion de vidéo à conserver
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Début</Label>
                        <span className="text-sm text-muted-foreground font-medium">
                          {Math.floor((trimStart / 100) * duration)}s
                        </span>
                      </div>
                      <Slider
                        value={[trimStart]}
                        onValueChange={([v]) => setTrimStart(Math.min(v, trimEnd - 5))}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Fin</Label>
                        <span className="text-sm text-muted-foreground font-medium">
                          {Math.floor((trimEnd / 100) * duration)}s
                        </span>
                      </div>
                      <Slider
                        value={[trimEnd]}
                        onValueChange={([v]) => setTrimEnd(Math.max(v, trimStart + 5))}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div className="text-center p-4 bg-muted rounded-xl">
                      <p className="text-sm text-muted-foreground">Durée sélectionnée</p>
                      <p className="text-3xl font-bold text-primary">
                        {Math.floor(((trimEnd - trimStart) / 100) * duration)}s
                      </p>
                    </div>
                  </div>
                </TabsContent>
              )}
            </ScrollArea>
            
            {/* Music Tab - Fixed at bottom for videos */}
            {isVideo && (
              <div className="border-t border-border p-3">
                <Button
                  variant={selectedMusic ? "default" : "outline"}
                  className="w-full gap-2"
                  onClick={() => setActiveTab(activeTab === "music" ? "filters" : "music")}
                >
                  <Music className="w-4 h-4" />
                  {selectedMusic ? "Musique ajoutée" : "Ajouter de la musique"}
                </Button>
              </div>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MediaEditor;
