import { useState } from "react";
import { MapPin, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegionData {
  name: string;
  headquarters: string;
  borderPosts: number;
  path: string;
}

const regions: RegionData[] = [
  {
    name: "Upper West",
    headquarters: "Wa",
    borderPosts: 5,
    path: "M85 45 L140 35 L145 90 L100 105 L75 85 Z",
  },
  {
    name: "Upper East",
    headquarters: "Bolgatanga",
    borderPosts: 6,
    path: "M145 35 L210 30 L220 85 L145 90 Z",
  },
  {
    name: "North East",
    headquarters: "Nalerigu",
    borderPosts: 3,
    path: "M220 85 L250 75 L255 130 L200 145 L180 125 Z",
  },
  {
    name: "Northern",
    headquarters: "Tamale",
    borderPosts: 4,
    path: "M100 105 L145 90 L220 85 L180 125 L200 145 L170 175 L110 165 L95 140 Z",
  },
  {
    name: "Savannah",
    headquarters: "Damongo",
    borderPosts: 4,
    path: "M60 100 L100 105 L95 140 L110 165 L85 185 L45 165 L50 120 Z",
  },
  {
    name: "Bono",
    headquarters: "Sunyani",
    borderPosts: 2,
    path: "M85 185 L110 165 L140 185 L135 220 L95 225 L80 205 Z",
  },
  {
    name: "Bono East",
    headquarters: "Techiman",
    borderPosts: 2,
    path: "M110 165 L170 175 L175 200 L140 215 L140 185 Z",
  },
  {
    name: "Ahafo",
    headquarters: "Goaso",
    borderPosts: 1,
    path: "M80 205 L95 225 L85 250 L60 245 L55 215 Z",
  },
  {
    name: "Ashanti",
    headquarters: "Kumasi",
    borderPosts: 2,
    path: "M95 225 L135 220 L175 200 L190 210 L180 260 L135 275 L100 265 L85 250 Z",
  },
  {
    name: "Oti",
    headquarters: "Dambai",
    borderPosts: 4,
    path: "M200 145 L255 130 L260 190 L220 215 L190 210 L175 200 L170 175 Z",
  },
  {
    name: "Eastern",
    headquarters: "Koforidua",
    borderPosts: 3,
    path: "M180 260 L190 210 L220 215 L230 250 L210 290 L175 295 L160 280 Z",
  },
  {
    name: "Volta",
    headquarters: "Ho",
    borderPosts: 5,
    path: "M230 250 L260 190 L280 185 L285 270 L260 320 L220 335 L210 290 Z",
  },
  {
    name: "Greater Accra",
    headquarters: "Accra",
    borderPosts: 3,
    path: "M175 295 L210 290 L220 335 L200 350 L170 345 L160 320 Z",
  },
  {
    name: "Central",
    headquarters: "Cape Coast",
    borderPosts: 2,
    path: "M100 310 L135 275 L160 280 L175 295 L160 320 L170 345 L135 360 L100 345 Z",
  },
  {
    name: "Western",
    headquarters: "Sekondi-Takoradi",
    borderPosts: 4,
    path: "M45 290 L80 275 L100 310 L100 345 L135 360 L130 385 L85 395 L40 360 Z",
  },
  {
    name: "Western North",
    headquarters: "Sefwi Wiawso",
    borderPosts: 3,
    path: "M55 245 L85 250 L100 265 L100 310 L80 275 L45 290 L40 260 Z",
  },
];

// Special entry points
const entryPoints = [
  { name: "KIA", fullName: "Kotoka International Airport", x: 190, y: 320, type: "airport" },
  { name: "Tema", fullName: "Tema Port", x: 210, y: 335, type: "seaport" },
];

interface GhanaMapProps {
  onRegionClick?: (region: string) => void;
  selectedRegion?: string | null;
}

export const GhanaMap = ({ onRegionClick, selectedRegion }: GhanaMapProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; region: RegionData } | null>(null);

  const handleRegionHover = (region: RegionData, event: React.MouseEvent<SVGPathElement>) => {
    setHoveredRegion(region.name);
    const rect = event.currentTarget.getBoundingClientRect();
    const svgRect = event.currentTarget.ownerSVGElement?.getBoundingClientRect();
    if (svgRect) {
      setTooltip({
        x: rect.left - svgRect.left + rect.width / 2,
        y: rect.top - svgRect.top,
        region,
      });
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute top-4 left-4 z-10 bg-card/95 backdrop-blur-sm rounded-lg p-3 border border-border shadow-lg">
        <h4 className="font-semibold text-sm text-foreground mb-2">Legend</h4>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-primary/60" />
            <span className="text-muted-foreground">Regional Command</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-muted-foreground">Airport</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500" />
            <span className="text-muted-foreground">Seaport</span>
          </div>
        </div>
      </div>

      <svg
        viewBox="0 0 320 420"
        className="w-full h-auto"
        style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.1))" }}
      >
        {/* Background */}
        <rect x="0" y="0" width="320" height="420" fill="transparent" />
        
        {/* Regions */}
        {regions.map((region) => (
          <path
            key={region.name}
            d={region.path}
            className={cn(
              "transition-all duration-300 cursor-pointer stroke-2",
              hoveredRegion === region.name || selectedRegion === region.name
                ? "fill-primary stroke-primary-foreground"
                : "fill-primary/40 stroke-primary/60 hover:fill-primary/70"
            )}
            onMouseEnter={(e) => handleRegionHover(region, e)}
            onMouseLeave={() => {
              setHoveredRegion(null);
              setTooltip(null);
            }}
            onClick={() => onRegionClick?.(region.name)}
          />
        ))}

        {/* Region Labels */}
        {regions.map((region) => {
          // Calculate approximate center of each region for label placement
          const pathParts = region.path.split(/[MLZ\s]+/).filter(Boolean);
          let sumX = 0, sumY = 0, count = 0;
          for (let i = 0; i < pathParts.length; i += 2) {
            const x = parseFloat(pathParts[i]);
            const y = parseFloat(pathParts[i + 1]);
            if (!isNaN(x) && !isNaN(y)) {
              sumX += x;
              sumY += y;
              count++;
            }
          }
          const centerX = count > 0 ? sumX / count : 0;
          const centerY = count > 0 ? sumY / count : 0;

          return (
            <text
              key={`label-${region.name}`}
              x={centerX}
              y={centerY}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-[8px] font-medium fill-foreground pointer-events-none select-none"
              style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}
            >
              {region.name.length > 10 ? region.name.split(" ")[0] : region.name}
            </text>
          );
        })}

        {/* Entry Points */}
        {entryPoints.map((point) => (
          <g key={point.name}>
            <circle
              cx={point.x}
              cy={point.y}
              r="8"
              className={cn(
                "transition-all duration-300",
                point.type === "airport" ? "fill-amber-500" : "fill-cyan-500"
              )}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="12"
              className={cn(
                "fill-transparent stroke-2 animate-pulse",
                point.type === "airport" ? "stroke-amber-500/50" : "stroke-cyan-500/50"
              )}
            />
            <text
              x={point.x}
              y={point.y - 16}
              textAnchor="middle"
              className="text-[9px] font-bold fill-foreground"
            >
              {point.name}
            </text>
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 bg-card border border-border rounded-lg p-3 shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y - 8 }}
        >
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm text-foreground">{tooltip.region.name} Region</span>
          </div>
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p className="flex items-center gap-1">
              <Building2 className="w-3 h-3" />
              HQ: {tooltip.region.headquarters}
            </p>
            <p>{tooltip.region.borderPosts} border posts</p>
          </div>
          <div className="absolute left-1/2 -bottom-2 w-4 h-4 bg-card border-r border-b border-border transform -translate-x-1/2 rotate-45" />
        </div>
      )}
    </div>
  );
};
