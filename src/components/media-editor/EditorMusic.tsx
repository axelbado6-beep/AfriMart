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
  Guitar,
  Music2,
  Headphones,
  Disc3,
  Waves
} from "lucide-react";

interface Track {
  id: string;
  name: string;
  artist: string;
  genre: string;
  subgenre?: string;
  duration: string;
  icon: any;
  bpm?: number;
  mood?: string;
}

interface EditorMusicProps {
  selectedTrack: string | null;
  volume: number;
  onSelectTrack: (trackId: string | null) => void;
  onVolumeChange: (volume: number) => void;
}

const MUSIC_LIBRARY: Track[] = [
  // Afrobeat
  { id: "afrobeat-1", name: "Lagos Nights", artist: "AfroVibes", genre: "Afrobeat", duration: "3:24", icon: Drum, bpm: 105, mood: "Énergique" },
  { id: "afrobeat-2", name: "Accra Flow", artist: "Ghana Sounds", genre: "Afrobeat", duration: "2:58", icon: Drum, bpm: 100, mood: "Dansant" },
  { id: "afrobeat-3", name: "Naija Power", artist: "Lagos Crew", genre: "Afrobeat", duration: "3:45", icon: Drum, bpm: 110, mood: "Puissant" },
  { id: "afrobeat-4", name: "African Queen", artist: "Abi Sounds", genre: "Afrobeat", duration: "4:02", icon: Drum, bpm: 98, mood: "Romantique" },
  { id: "afrobeat-5", name: "Jollof Vibes", artist: "West Side", genre: "Afrobeat", duration: "3:18", icon: Drum, bpm: 108, mood: "Festif" },
  
  // Coupé-Décalé
  { id: "coupedecale-1", name: "Abidjan Style", artist: "DJ Arafat Style", genre: "Coupé-Décalé", duration: "3:55", icon: Disc3, bpm: 120, mood: "Festif" },
  { id: "coupedecale-2", name: "Décalé Gwada", artist: "Magic System Vibes", genre: "Coupé-Décalé", duration: "3:32", icon: Disc3, bpm: 125, mood: "Dansant" },
  { id: "coupedecale-3", name: "Congossa", artist: "Abidjan All Stars", genre: "Coupé-Décalé", duration: "4:10", icon: Disc3, bpm: 118, mood: "Énergique" },
  { id: "coupedecale-4", name: "Premier Gaou", artist: "Ivorian Beats", genre: "Coupé-Décalé", duration: "3:40", icon: Disc3, bpm: 122, mood: "Joyeux" },
  
  // Amapiano
  { id: "amapiano-1", name: "Johannesburg Groove", artist: "SA Beats", genre: "Amapiano", duration: "4:30", icon: Waves, bpm: 115, mood: "Groovy" },
  { id: "amapiano-2", name: "Piano Dreams", artist: "Pretoria Sounds", genre: "Amapiano", duration: "3:48", icon: Waves, bpm: 112, mood: "Chill" },
  { id: "amapiano-3", name: "Soweto Nights", artist: "Township Vibes", genre: "Amapiano", duration: "4:15", icon: Waves, bpm: 118, mood: "Dansant" },
  { id: "amapiano-4", name: "African Piano", artist: "Durban Crew", genre: "Amapiano", duration: "3:55", icon: Waves, bpm: 110, mood: "Mélodique" },
  
  // Afro-Trap
  { id: "afrotrap-1", name: "Jungle Safari", artist: "African Trap Kings", genre: "Afro-Trap", duration: "2:55", icon: Mic, bpm: 140, mood: "Intense" },
  { id: "afrotrap-2", name: "Sapologie", artist: "Congo Fresh", genre: "Afro-Trap", duration: "3:12", icon: Mic, bpm: 135, mood: "Stylé" },
  { id: "afrotrap-3", name: "Aya Nakamura Flow", artist: "Paris Africa", genre: "Afro-Trap", duration: "3:28", icon: Mic, bpm: 138, mood: "Moderne" },
  
  // Ndombolo
  { id: "ndombolo-1", name: "Kinshasa Dance", artist: "Congo Stars", genre: "Ndombolo", duration: "4:20", icon: Drum, bpm: 130, mood: "Dansant" },
  { id: "ndombolo-2", name: "Zaïre Classic", artist: "Kinshasa Crew", genre: "Ndombolo", duration: "3:50", icon: Drum, bpm: 128, mood: "Festif" },
  
  // Highlife
  { id: "highlife-1", name: "Ghana Classic", artist: "Accra Legends", genre: "Highlife", duration: "4:45", icon: Guitar, bpm: 95, mood: "Nostalgique" },
  { id: "highlife-2", name: "Palm Wine Sunset", artist: "West African Jazz", genre: "Highlife", duration: "5:10", icon: Guitar, bpm: 90, mood: "Relaxant" },
  
  // Mbalax
  { id: "mbalax-1", name: "Dakar Rhythm", artist: "Senegal Stars", genre: "Mbalax", duration: "3:35", icon: Drum, bpm: 125, mood: "Rythmique" },
  { id: "mbalax-2", name: "Sabar Dance", artist: "Youssou Vibes", genre: "Mbalax", duration: "4:00", icon: Drum, bpm: 128, mood: "Traditionnel" },
  
  // Zouglou
  { id: "zouglou-1", name: "Abidjan Morning", artist: "Zouglou Masters", genre: "Zouglou", duration: "3:42", icon: Music2, bpm: 108, mood: "Joyeux" },
  { id: "zouglou-2", name: "Ivorian Story", artist: "Côte d'Ivoire Crew", genre: "Zouglou", duration: "4:05", icon: Music2, bpm: 105, mood: "Storytelling" },
  
  // Hip-Hop
  { id: "hiphop-1", name: "Street Dreams", artist: "Urban Kings", genre: "Hip-Hop", duration: "3:12", icon: Mic, bpm: 90, mood: "Cool" },
  { id: "hiphop-2", name: "City Lights", artist: "Metro Beats", genre: "Hip-Hop", duration: "2:45", icon: Mic, bpm: 85, mood: "Urbain" },
  
  // Pop
  { id: "pop-1", name: "Summer Vibes", artist: "Sunny Day", genre: "Pop", duration: "3:30", icon: Radio, bpm: 120, mood: "Joyeux" },
  { id: "pop-2", name: "Feel Good", artist: "Happy Tunes", genre: "Pop", duration: "2:55", icon: Radio, bpm: 125, mood: "Positif" },
  
  // R&B
  { id: "rnb-1", name: "Smooth Love", artist: "Velvet Voice", genre: "R&B", duration: "4:02", icon: Piano, bpm: 75, mood: "Romantique" },
  { id: "rnb-2", name: "Midnight Soul", artist: "Soul Sisters", genre: "R&B", duration: "3:45", icon: Piano, bpm: 80, mood: "Sensuel" },
  
  // Dancehall
  { id: "dancehall-1", name: "Caribbean Heat", artist: "Island Vibes", genre: "Dancehall", duration: "3:18", icon: Headphones, bpm: 100, mood: "Tropical" },
  { id: "dancehall-2", name: "Reggae Sun", artist: "Kingston Flow", genre: "Dancehall", duration: "3:28", icon: Headphones, bpm: 95, mood: "Relaxant" },
];

const GENRES = [
  "Tous",
  "Afrobeat", 
  "Coupé-Décalé", 
  "Amapiano", 
  "Afro-Trap",
  "Ndombolo",
  "Highlife",
  "Mbalax",
  "Zouglou",
  "Hip-Hop", 
  "Pop", 
  "R&B", 
  "Dancehall"
];

const MOODS = ["Tous", "Énergique", "Dansant", "Chill", "Romantique", "Festif", "Groovy"];

const EditorMusic = ({ selectedTrack, volume, onSelectTrack, onVolumeChange }: EditorMusicProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Tous");
  const [selectedMood, setSelectedMood] = useState("Tous");
  const [isPlaying, setIsPlaying] = useState(false);

  const filteredTracks = MUSIC_LIBRARY.filter(track => {
    const matchesSearch = track.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         track.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "Tous" || track.genre === selectedGenre;
    const matchesMood = selectedMood === "Tous" || track.mood === selectedMood;
    return matchesSearch && matchesGenre && matchesMood;
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

  const getGenreColor = (genre: string) => {
    const colors: Record<string, string> = {
      "Afrobeat": "from-orange-500 to-amber-500",
      "Coupé-Décalé": "from-green-500 to-emerald-500",
      "Amapiano": "from-purple-500 to-pink-500",
      "Afro-Trap": "from-red-500 to-orange-500",
      "Ndombolo": "from-blue-500 to-cyan-500",
      "Highlife": "from-amber-500 to-yellow-500",
      "Mbalax": "from-teal-500 to-green-500",
      "Zouglou": "from-lime-500 to-green-500",
      "Hip-Hop": "from-gray-600 to-gray-800",
      "Pop": "from-pink-500 to-rose-500",
      "R&B": "from-violet-500 to-purple-500",
      "Dancehall": "from-yellow-500 to-orange-500",
    };
    return colors[genre] || "from-gray-500 to-gray-600";
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm text-muted-foreground">
        Ajoutez une musique africaine à votre story 🎵
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
                  ? "bg-gradient-to-r from-afrimart-orange to-afrimart-gold text-white scale-105 shadow-lg"
                  : "bg-muted hover:bg-muted/80 hover:scale-105"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Mood Pills */}
      <ScrollArea className="w-full">
        <div className="flex gap-2 pb-2">
          {MOODS.map((mood) => (
            <button
              key={mood}
              onClick={() => setSelectedMood(mood)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-all duration-300 ${
                selectedMood === mood
                  ? "bg-primary text-primary-foreground scale-105"
                  : "bg-muted/50 hover:bg-muted hover:scale-105"
              }`}
            >
              {mood === "Tous" ? "🎧 Tous" : mood}
            </button>
          ))}
        </div>
      </ScrollArea>

      {/* Track List */}
      <ScrollArea className="h-[180px]">
        <div className="space-y-2 pr-2">
          {filteredTracks.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              Aucune musique trouvée 🎵
            </p>
          ) : (
            filteredTracks.map((track, i) => {
              const IconComponent = track.icon;
              const isSelected = selectedTrack === track.id;
              
              return (
                <button
                  key={track.id}
                  onClick={() => handleTrackSelect(track.id)}
                  className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all duration-300 group ${
                    isSelected
                      ? "border-primary bg-primary/10 scale-[1.02] shadow-lg"
                      : "border-border hover:border-primary/50 hover:bg-muted/50 hover:scale-[1.01]"
                  }`}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  {/* Icon / Play Button */}
                  <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-gradient-to-br ${getGenreColor(track.genre)} ${
                    isSelected ? "shadow-lg" : "group-hover:shadow-md"
                  }`}>
                    {isSelected && isPlaying ? (
                      <Pause className="w-4 h-4 text-white" />
                    ) : isSelected ? (
                      <Play className="w-4 h-4 ml-0.5 text-white" />
                    ) : (
                      <IconComponent className="w-4 h-4 text-white" />
                    )}
                    {/* Playing animation */}
                    {isSelected && isPlaying && (
                      <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-ping" />
                    )}
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 text-left min-w-0">
                    <p className={`font-medium text-sm truncate transition-colors ${
                      isSelected ? "text-primary" : ""
                    }`}>
                      {track.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.artist}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full bg-gradient-to-r ${getGenreColor(track.genre)} text-white`}>
                        {track.genre}
                      </span>
                      {track.bpm && (
                        <span className="text-[9px] text-muted-foreground">
                          {track.bpm} BPM
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Duration */}
                  <span className="text-xs text-muted-foreground shrink-0">
                    {track.duration}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>

      {/* Volume Control */}
      {selectedTrack && (
        <div className="space-y-2 p-4 bg-gradient-to-br from-muted to-muted/50 rounded-xl animate-fade-in border border-border">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              {volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
              Volume
            </Label>
            <span className="text-sm font-medium">{volume}%</span>
          </div>
          <Slider
            value={[volume]}
            onValueChange={([v]) => onVolumeChange(v)}
            min={0}
            max={100}
            step={5}
            className="[&>span:first-child]:bg-gradient-to-r [&>span:first-child]:from-afrimart-orange [&>span:first-child]:to-afrimart-gold"
          />
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? "Pause" : "Écouter"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onSelectTrack(null)}
            >
              <Music className="w-4 h-4 mr-2" />
              Retirer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorMusic;
