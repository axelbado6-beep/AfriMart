import { useEffect, useRef } from "react";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allCategories, getCategoryConfig } from "./CategoryColors";

type Props = { category: string; sub: string; onSelect: (category: string, sub?: string) => void };

export function CategorySelector({ category, sub, onSelect }: Props) {
  const selectedRef = useRef<HTMLButtonElement>(null);
  const config = getCategoryConfig(category);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({ block: "nearest", inline: "center", behavior: "auto" });
  }, [category]);

  return (
    <nav aria-label="Rayons du catalogue" className="space-y-3 py-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1" aria-label="Catégories">
        {allCategories.map(name => {
          const Icon = getCategoryConfig(name).icon;
          return <Button key={name} ref={name === category ? selectedRef : undefined}
            variant={name === category ? "default" : "outline"} aria-pressed={name === category}
            onClick={() => onSelect(name)} className="shrink-0 rounded-full h-10 motion-safe:active:scale-95">
            <Icon className="h-4 w-4" />{name}
          </Button>;
        })}
      </div>
      {config.subcategories.length > 0 && <>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>{category}</span><ChevronRight className="h-3 w-3" /><span className="font-medium text-foreground">{sub || "Tout le rayon"}</span>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1" aria-label="Sous-catégories">
          {["", ...config.subcategories].map(name => <Button key={name} size="sm"
            variant={sub === name ? "default" : "outline"} aria-pressed={sub === name}
            className="shrink-0 rounded-full" onClick={() => onSelect(category, name)}>
            {name || "Tout le rayon"}
          </Button>)}
        </div>
      </>}
    </nav>
  );
}