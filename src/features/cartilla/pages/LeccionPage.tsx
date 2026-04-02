import { useParams, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Target, Zap } from "lucide-react";
import { AREA_MAP } from "@/data/areas";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ParagraphList, RichTextSpan } from "@/features/cartilla/components/ContentRenderer";
import { ActivityCard } from "@/features/cartilla/components/ActivityCard";
import { QuizPlaceholder } from "@/features/cartilla/components/QuizPlaceholder";
import { ReflexionZone } from "@/features/cartilla/components/ReflexionZone";
import type { Area, Leccion } from "@/features/cartilla/types";

async function loadArea(slug: string): Promise<Area | null> {
  try {
    const mod = await import(`../../../data/${slug}.json`);
    return mod.default as Area;
  } catch {
    return null;
  }
}

export function LeccionPage() {
  const { areaSlug, unidadId, leccionId } = useParams<{
    areaSlug: string; unidadId: string; leccionId: string;
  }>();
  const [leccion, setLeccion] = useState<Leccion | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const navArea = areaSlug ? AREA_MAP[areaSlug] : undefined;

  useEffect(() => {
    if (!areaSlug || !unidadId || !leccionId) return;
    setLoading(true);
    loadArea(areaSlug).then((data) => {
      const u = data?.unidades.find(u => u.id === unidadId);
      const l = u?.lecciones.find(l => l.id === leccionId) || null;
      setLeccion(l);
      setLoading(false);
    });
  }, [areaSlug, unidadId, leccionId]);

  if (!navArea) return <Navigate to="/" replace />;

  const hasQuiz = leccion?.actividades.some(a => a.tipo === "quiz") ?? false;
  const hasReflexion = leccion?.actividades.some(a => a.tipo === "reflexion") ?? false;
  const otherActividades = leccion?.actividades.filter(a => a.tipo !== "quiz" && a.tipo !== "reflexion") ?? [];

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate(`/${areaSlug}/${unidadId}`)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Volver a la unidad
      </button>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-6 w-1/2 rounded" />
          <Skeleton className="h-4 rounded" />
          <Skeleton className="h-4 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
        </div>
      ) : !leccion ? (
        <div className="text-center py-12 text-muted-foreground">
          Lección no encontrada.
        </div>
      ) : (
        <>
          {/* Header */}
          <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${navArea.gradientClass} p-6 md:p-8 text-white`}>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge className="bg-white/20 text-white border-0 text-xs">{navArea.nombre}</Badge>
                {leccion.actividades.length > 0 && (
                  <Badge className="bg-white/20 text-white border-0 text-xs gap-1">
                    <Zap className="h-3 w-3" />
                    {leccion.actividades.length} {leccion.actividades.length === 1 ? "actividad" : "actividades"}
                  </Badge>
                )}
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold leading-tight">
                <RichTextSpan segments={leccion.titulo} />
              </h1>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
          </div>

          {/* Objective */}
          {leccion.objetivo && leccion.objetivo.length > 0 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-border/40">
              <Target className={`h-5 w-5 mt-0.5 shrink-0 text-muted-foreground`} />
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Objetivo</p>
                <p className="text-sm text-foreground leading-relaxed">
                  <RichTextSpan segments={leccion.objetivo} />
                </p>
              </div>
            </div>
          )}

          {/* Main tabs: Contenido / Actividades */}
          <Tabs defaultValue="contenido">
            <TabsList>
              <TabsTrigger value="contenido">📖 Contenido</TabsTrigger>
              {leccion.actividades.length > 0 && (
                <TabsTrigger value="actividades">⚡ Actividades ({leccion.actividades.length})</TabsTrigger>
              )}
            </TabsList>

            {/* Contenido tab */}
            <TabsContent value="contenido" className="mt-4">
              {leccion.contenido.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-8">
                  Esta lección no tiene contenido de cuerpo registrado.
                </p>
              ) : (
                <div className="prose-like space-y-4">
                  <ParagraphList paragraphs={leccion.contenido} />

                  {/* Reflexion zone at end of content */}
                  {hasReflexion && (
                    <>
                      <Separator className="my-6" />
                      <ReflexionZone areaGradient={navArea.gradientClass} />
                    </>
                  )}
                </div>
              )}
            </TabsContent>

            {/* Actividades tab */}
            {leccion.actividades.length > 0 && (
              <TabsContent value="actividades" className="mt-4 space-y-4">
                {/* Quiz first if present */}
                {hasQuiz && (
                  <QuizPlaceholder
                    areaColor={navArea.colorClass}
                    areaGradient={navArea.gradientClass}
                  />
                )}
                {/* Other activities */}
                {otherActividades.map((act, i) => (
                  <ActivityCard key={act.id} actividad={act} index={i} />
                ))}
                {/* Reflexión at the end */}
                {hasReflexion && (
                  <ReflexionZone
                    areaGradient={navArea.gradientClass}
                    prompt="Reflexiona sobre las actividades realizadas: ¿qué aprendiste? ¿qué fue lo más difícil?"
                  />
                )}
              </TabsContent>
            )}
          </Tabs>
        </>
      )}
    </div>
  );
}
