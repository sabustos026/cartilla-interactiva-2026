import { useParams, Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { AREA_MAP } from "@/data/areas";
import { Skeleton } from "@/components/ui/skeleton";
import { RichTextSpan } from "@/features/cartilla/components/ContentRenderer";
import type { Area, Unidad } from "@/features/cartilla/types";

async function loadArea(slug: string): Promise<Area | null> {
  try {
    const mod = await import(`../../../data/${slug}.json`);
    return mod.default as Area;
  } catch {
    return null;
  }
}

export function UnidadPage() {
  const { areaSlug, unidadId } = useParams<{ areaSlug: string; unidadId: string }>();
  const [unidad, setUnidad] = useState<Unidad | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const navArea = areaSlug ? AREA_MAP[areaSlug] : undefined;

  useEffect(() => {
    if (!areaSlug || !unidadId) return;
    setLoading(true);
    loadArea(areaSlug).then((data) => {
      const found = data?.unidades.find(u => u.id === unidadId) || null;
      setUnidad(found);
      setLoading(false);
    });
  }, [areaSlug, unidadId]);

  if (!navArea) return <Navigate to="/" replace />;

  const nombre = unidad?.nombre.map(s => s.text).join("").trim() || "Unidad";

  return (
    <div className="space-y-6">
      {/* Back + Breadcrumb */}
      <button
        onClick={() => navigate(`/${areaSlug}`)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver a {navArea.nombre}
      </button>

      {/* Unit header */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${navArea.gradientClass} p-6 text-white`}>
        <div className="relative z-10">
          <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-1">
            {navArea.nombre}
            {unidad?.periodo ? ` · Período ${unidad.periodo}` : ""}
            {unidad?.grado ? ` · ${unidad.grado}` : ""}
          </p>
          <h1 className="text-xl md:text-2xl font-extrabold leading-tight">
            {loading ? "Cargando..." : <RichTextSpan segments={unidad?.nombre || [{ text: nombre, bold: true }]} />}
          </h1>
        </div>
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
      </div>

      {/* Lecciones */}
      <div>
        <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
          <span className={`h-5 w-1 rounded-full ${navArea.colorClass} inline-block`} />
          Lecciones
        </h2>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
          </div>
        ) : !unidad || unidad.lecciones.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No hay lecciones disponibles en esta unidad.
          </div>
        ) : (
          <div className="space-y-2">
            {unidad.lecciones.map((leccion, index) => {
              const leccionNombre = leccion.titulo.map(s => s.text).join("").trim() || `Lección ${index + 1}`;
              return (
                <Link
                  key={leccion.id}
                  to={`/${areaSlug}/${unidadId}/${leccion.id}`}
                  className="group flex items-center gap-4 rounded-xl border border-border/60 bg-card px-4 py-3.5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <span className="text-sm font-bold text-muted-foreground w-6 shrink-0 text-center">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {leccionNombre}
                    </p>
                    {leccion.actividades.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {leccion.actividades.length} {leccion.actividades.length === 1 ? "actividad" : "actividades"}
                      </p>
                    )}
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-200 shrink-0" />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
