import { Palette, Heart, Globe, MapPin, BookOpen, Handshake, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { NavArea } from "@/features/cartilla/types";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Palette, Heart, Globe, MapPin, BookOpen, Handshake,
};

interface Props {
  area: NavArea;
}

export function AreaCard({ area }: Props) {
  const Icon = ICON_MAP[area.iconName] || BookOpen;

  return (
    <Link to={`/${area.id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
        {/* Color header strip */}
        <div className={`h-2 w-full bg-gradient-to-r ${area.gradientClass}`} />

        <div className="p-5">
          {/* Icon + Label */}
          <div className="flex items-start justify-between mb-3">
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${area.gradientClass} flex items-center justify-center shadow-md`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200 mt-1" />
          </div>

          <h3 className="font-bold text-lg text-foreground leading-tight mb-1">
            {area.nombre}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {area.descripcion}
          </p>

          {area.totalUnidades > 0 && (
            <div className="mt-4 pt-3 border-t border-border/50">
              <span className="text-xs text-muted-foreground">
                {area.totalUnidades} {area.totalUnidades === 1 ? "unidad" : "unidades"}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
