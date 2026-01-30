import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Music, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Search,
  Mic,
  Radio,
  Drum,
  Piano,
  Guitar
} from "lucide-react";

interface Track {
  id: string;
  name: string;
  artist: string;
  genre: string;
  duration: string;
  icon: any;
}

interface EditorMusicProps {
  selectedTrack: string | null;
  volume: number;
  onSelectTrack: (trackId: string | null) => void;
  onVolumeChange: (volume: number) => void;
}

const MUSIC_LIBRARY: Track[] = [
  { id: "afrobeat-1", name: "Lagos Nights", artist: "AfroVibes", genre: "Afrobeat", duration: "3:24", icon: Drum },
  { id: "afrobeat-2", name: "Accra Flow", artist: "Ghana Sounds", genre: "Afrobeat", duration: "2:58", icon: Drum },
  { id: "hiphop-1", name: "Street Dreams", artist: "Urban Kings", genre: "Hip-Hop", duration: "3:12", icon: Mic },
  { id: "hiphop-2", name: "City Lights", artist: "Metro Beats", genre: "Hip-Hop", duration: "2:45", icon: Mic },
  { id: "pop-1", name: "Summer Vibes", artist: "Sunny Day", genre: "Pop", duration: "3:30", icon: Radio },
  { id: "pop-2", name: "Feel Good", artist: "Happy Tunes", genre: "Pop", duration: "2:55", icon: Radio },
  { id: "rnb-1", name: "Smooth Love", artist: "Velvet Voice", genre: "R&B", duration: "4:02", icon: Piano },
  { id: "rnb-2", name: "Midnight Soul", artist: "Soul Sisters", genre: "R&B", duration: "3:45", icon: Piano },
  { id: "dancehall-1", name: "Caribbean Heat", artist: "Island Vibes", genre: "Dancehall", duration: "3:18", icon: Guitar },
  { id: "coupedecale-1", name: "Abidjan Style", artist: "DJ Arafat Style", genre: "Coupé-Décalé", duration: "3:55", icon: Drum },
];

const GENRES = ["Tous", "Afrobeat", "Hip-Hop", "Pop", "R&B", "Dancehall", "Coupé-Décalé"];

const EditorMusic = ({ selectedTrack, volume, onSelectTrack, onVolumeChange }: EditorMusicProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Tous");
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredTracks = MUSIC_LIBRARY.filter(track => {
    const matchesSearch = track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "Tous" || track.genre === selectedGenre;
    return matchesSearch && matchesGenre;
  });

  const handleTrackSelect = (trackId: string) => {
    if (selectedTrack === trackId) {
      onSelectTrack(null);
      setIsPlaying(false);
    } else {
      onSelectTrack(trackId);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (selectedTrack) {
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm text-muted-foreground">
        Ajoutez une musique de fond à votre story
      </p>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une musique..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Genre Pills */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-300 ${
                selectedGenre === genre
                  ? "bg-primary text-primary-foreground scale-105"
                  : "bg-muted hover:bg-muted/80 hover:scale-105"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Track List */}
      <ScrollArea className="h-[200px]">
        <div className="space-y-2 pr-2">
          {filteredTracks.map((track, i) => {
            const IconComponent = track.icon;
            const isSelected = selectedTrack === track.id;
            
            return (
              <button
                key={track.id}
                onClick={() => handleTrackSelect(track.id)}
                className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all duration-300 group ${
                  isSelected
                    ? "border-primary bg-primary/10 scale-[1.02]"
                    : "border-border hover:border-primary/50 hover:bg-muted/50 hover:scale-[1.01]"
                }`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                {/* Icon / Play Button */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted group-hover:bg-primary/20"
                }`}>
                  {isSelected && isPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : isSelected ? (
                    <Play className="w-4 h-4 ml-0.5" />
                  ) : (
                    <IconComponent className="w-4 h-4" />
                  )}
                </div>

                {/* Track Info */}
                <div className="flex-1 text-left">
                  <p className={`font-medium text-sm transition-colors ${
                    isSelected ? "text-primary" : ""
                  }`}>
                    {track.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {track.artist} • {track.genre}
                  </p>
                </div>

                {/* Duration */}
                <span className="text-xs text-muted-foreground">
                  {track.duration}
                </span>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Volume Control */}
      {selectedTrack && (
        <div className="space-y-2 p-4 bg-muted rounded-xl animate-fade-in">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              {volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              Volume
            </Label>
            <span className="text-sm text-muted-foreground">{volume}%</span>
          </div>
          <Slider
            value={[volume]}
            onValueChange={([v]) => onVolumeChange(v)}
            min={0}
            max={100}
            step={5}
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
            onClick={() => onSelectTrack(null)}
          >
            <Music className="w-4 h-4 mr-2" />
            Retirer la musique
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditorMusic;
