import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  X, 
  Type, 
  Palette, 
  Sliders, 
  Sparkles, 
  Music, 
  Scissors,
  RotateCcw,
  Download,
  Upload,
  Play,
  Pause,
  Check
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

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
}

interface FilterSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  hueRotate: number;
}

const FILTERS = [
  { name: "Normal", settings: { brightness: 100, contrast: 100, saturation: 100, blur: 0, hueRotate: 0 } },
  { name: "Vivid", settings: { brightness: 110, contrast: 120, saturation: 130, blur: 0, hueRotate: 0 } },
  { name: "Vintage", settings: { brightness: 90, contrast: 110, saturation: 70, blur: 0, hueRotate: 20 } },
  { name: "Noir", settings: { brightness: 100, contrast: 130, saturation: 0, blur: 0, hueRotate: 0 } },
  { name: "Warm", settings: { brightness: 105, contrast: 105, saturation: 110, blur: 0, hueRotate: -10 } },
  { name: "Cool", settings: { brightness: 100, contrast: 105, saturation: 90, blur: 0, hueRotate: 180 } },
  { name: "Dramatic", settings: { brightness: 90, contrast: 150, saturation: 80, blur: 0, hueRotate: 0 } },
  { name: "Soft", settings: { brightness: 110, contrast: 90, saturation: 90, blur: 1, hueRotate: 0 } },
];

const FONTS = [
  "Inter",
  "Georgia",
  "Courier New",
  "Impact",
  "Comic Sans MS",
  "Arial Black",
];

const MediaEditor = ({ file, onSave, onCancel }: MediaEditorProps) => {
  const isVideo = file.type.startsWith("video/");
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(100);
  
  const [filters, setFilters] = useState<FilterSettings>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    hueRotate: 0,
  });
  
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [newTextInput, setNewTextInput] = useState("");
  
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
    return `
      brightness(${filters.brightness}%) 
      contrast(${filters.contrast}%) 
      saturate(${filters.saturation}%) 
      blur(${filters.blur}px) 
      hue-rotate(${filters.hueRotate}deg)
    `;
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
      fontFamily: "Inter",
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

  const handleSave = async () => {
    // For photos, render to canvas and export
    if (!isVideo && imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = imageRef.current;
      
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      
      if (ctx) {
        // Apply filters
        ctx.filter = getFilterStyle();
        ctx.drawImage(img, 0, 0);
        
        // Reset filter for text
        ctx.filter = "none";
        
        // Draw text overlays
        textOverlays.forEach(text => {
          ctx.font = `${text.fontSize * (canvas.width / 400)}px ${text.fontFamily}`;
          ctx.fillStyle = text.color;
          ctx.textAlign = "center";
          ctx.fillText(
            text.text, 
            (text.x / 100) * canvas.width, 
            (text.y / 100) * canvas.height
          );
        });
        
        canvas.toBlob((blob) => {
          if (blob) {
            onSave(blob, blob);
          }
        }, "image/jpeg", 0.95);
      }
    } else if (isVideo) {
      // For video, we'll save with metadata for now
      // Full video processing would require FFmpeg WebAssembly
      const blob = new Blob([file], { type: file.type });
      
      // Create thumbnail from current frame
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

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="w-5 h-5" />
        </Button>
        <h2 className="font-display font-bold">Éditeur {isVideo ? "Vidéo" : "Photo"}</h2>
        <Button onClick={handleSave} className="btn-business gap-2">
          <Check className="w-4 h-4" />
          Terminer
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Preview Area */}
        <div 
          ref={containerRef}
          className="flex-1 relative flex items-center justify-center bg-black/90 overflow-hidden"
        >
          <div className="relative max-w-full max-h-full">
            {isVideo ? (
              <video
                ref={videoRef}
                src={mediaUrl}
                className="max-w-full max-h-[60vh] md:max-h-[70vh]"
                style={{ filter: getFilterStyle() }}
                onClick={togglePlay}
                playsInline
              />
            ) : (
              <img
                ref={imageRef}
                src={mediaUrl}
                alt="Editing"
                className="max-w-full max-h-[60vh] md:max-h-[70vh] object-contain"
                style={{ filter: getFilterStyle() }}
                crossOrigin="anonymous"
              />
            )}
            
            {/* Text Overlays */}
            {textOverlays.map(text => (
              <div
                key={text.id}
                className={`absolute cursor-move select-none transition-all ${
                  selectedText === text.id ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
                style={{
                  left: `${text.x}%`,
                  top: `${text.y}%`,
                  transform: "translate(-50%, -50%)",
                  fontSize: `${text.fontSize}px`,
                  color: text.color,
                  fontFamily: text.fontFamily,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.8)",
                }}
                onClick={() => setSelectedText(text.id)}
              >
                {text.text}
              </div>
            ))}

            {/* Video Controls */}
            {isVideo && (
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/50 text-white hover:bg-black/70"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <div className="flex-1 bg-white/20 rounded-full h-1">
                  <div 
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <span className="text-white text-sm">
                  {Math.floor(currentTime)}s / {Math.floor(duration)}s
                </span>
              </div>
            )}
          </div>
          
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls Panel */}
        <div className="w-full md:w-80 border-t md:border-t-0 md:border-l border-border bg-card">
          <Tabs defaultValue="filters" className="h-full flex flex-col">
            <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent p-0">
              <TabsTrigger 
                value="filters" 
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Filtres
              </TabsTrigger>
              <TabsTrigger 
                value="adjust"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                <Sliders className="w-4 h-4 mr-2" />
                Ajuster
              </TabsTrigger>
              <TabsTrigger 
                value="text"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
              >
                <Type className="w-4 h-4 mr-2" />
                Texte
              </TabsTrigger>
              {isVideo && (
                <TabsTrigger 
                  value="trim"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                >
                  <Scissors className="w-4 h-4 mr-2" />
                  Couper
                </TabsTrigger>
              )}
            </TabsList>

            <ScrollArea className="flex-1">
              <TabsContent value="filters" className="p-4 m-0">
                <div className="grid grid-cols-3 gap-2">
                  {FILTERS.map(filter => (
                    <button
                      key={filter.name}
                      onClick={() => applyFilter(filter)}
                      className={`p-2 rounded-lg border transition-all ${
                        JSON.stringify(filters) === JSON.stringify(filter.settings)
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div 
                        className="aspect-square rounded bg-muted mb-1 overflow-hidden"
                        style={{
                          background: `linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))`,
                          filter: `brightness(${filter.settings.brightness}%) contrast(${filter.settings.contrast}%) saturate(${filter.settings.saturation}%) hue-rotate(${filter.settings.hueRotate}deg)`
                        }}
                      />
                      <span className="text-xs">{filter.name}</span>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="adjust" className="p-4 m-0 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Luminosité</Label>
                    <span className="text-sm text-muted-foreground">{filters.brightness}%</span>
                  </div>
                  <Slider
                    value={[filters.brightness]}
                    onValueChange={([v]) => setFilters({...filters, brightness: v})}
                    min={50}
                    max={150}
                    step={1}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Contraste</Label>
                    <span className="text-sm text-muted-foreground">{filters.contrast}%</span>
                  </div>
                  <Slider
                    value={[filters.contrast]}
                    onValueChange={([v]) => setFilters({...filters, contrast: v})}
                    min={50}
                    max={150}
                    step={1}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Saturation</Label>
                    <span className="text-sm text-muted-foreground">{filters.saturation}%</span>
                  </div>
                  <Slider
                    value={[filters.saturation]}
                    onValueChange={([v]) => setFilters({...filters, saturation: v})}
                    min={0}
                    max={200}
                    step={1}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Label>Teinte</Label>
                    <span className="text-sm text-muted-foreground">{filters.hueRotate}°</span>
                  </div>
                  <Slider
                    value={[filters.hueRotate]}
                    onValueChange={([v]) => setFilters({...filters, hueRotate: v})}
                    min={0}
                    max={360}
                    step={1}
                  />
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
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

              <TabsContent value="text" className="p-4 m-0 space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Ajouter du texte..."
                    value={newTextInput}
                    onChange={(e) => setNewTextInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTextOverlay()}
                  />
                  <Button onClick={addTextOverlay} size="icon">
                    <Type className="w-4 h-4" />
                  </Button>
                </div>

                {selectedTextOverlay && (
                  <div className="space-y-4 p-4 bg-muted rounded-lg">
                    <div className="flex justify-between items-center">
                      <Label>Éditer le texte</Label>
                      <Button 
                        variant="ghost" 
                        size="icon"
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
                        min={12}
                        max={72}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Position X</Label>
                      <Slider
                        value={[selectedTextOverlay.x]}
                        onValueChange={([v]) => updateTextOverlay(selectedTextOverlay.id, { x: v })}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Position Y</Label>
                      <Slider
                        value={[selectedTextOverlay.y]}
                        onValueChange={([v]) => updateTextOverlay(selectedTextOverlay.id, { y: v })}
                        min={0}
                        max={100}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Couleur</Label>
                      <div className="flex gap-2">
                        {["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"].map(color => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-full border-2 ${
                              selectedTextOverlay.color === color ? "border-primary" : "border-transparent"
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
                        className="w-full p-2 bg-background border border-border rounded-md"
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
                  </div>
                )}

                {textOverlays.length > 0 && (
                  <div className="space-y-2">
                    <Label>Textes ajoutés</Label>
                    {textOverlays.map(text => (
                      <div 
                        key={text.id}
                        className={`p-2 rounded border cursor-pointer transition-colors ${
                          selectedText === text.id ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => setSelectedText(text.id)}
                      >
                        {text.text}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {isVideo && (
                <TabsContent value="trim" className="p-4 m-0 space-y-4">
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
                        <span className="text-sm text-muted-foreground">
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
                        <span className="text-sm text-muted-foreground">
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

                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Durée sélectionnée</p>
                      <p className="text-2xl font-bold">
                        {Math.floor(((trimEnd - trimStart) / 100) * duration)}s
                      </p>
                    </div>
                  </div>
                </TabsContent>
              )}
            </ScrollArea>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MediaEditor;
