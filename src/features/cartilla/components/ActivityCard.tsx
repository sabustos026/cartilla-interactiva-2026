import { CheckSquare, Lightbulb, PenLine, Search, BookOpen, ClipboardCheck, Star } from "lucide-react";
import type { Actividad } from "@/features/cartilla/types";
import { ParagraphList, RichTextSpan } from "./ContentRenderer";

const TIPO_CONFIG = {
  tarea: { icon: CheckSquare, color: "from-blue-500 to-indigo-600", label: "Tarea", bg: "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50" },
  reflexion: { icon: Lightbulb, color: "from-amber-500 to-yellow-600", label: "Reflexión", bg: "bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/50" },
  quiz: { icon: ClipboardCheck, color: "from-violet-500 to-purple-600", label: "Quiz", bg: "bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800/50" },
  creativa: { icon: PenLine, color: "from-rose-500 to-pink-600", label: "Actividad Creativa", bg: "bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/50" },
  investigacion: { icon: Search, color: "from-teal-500 to-emerald-600", label: "Investigación", bg: "bg-teal-50 dark:bg-teal-950/20 border-teal-200 dark:border-teal-800/50" },
  lectura: { icon: BookOpen, color: "from-sky-500 to-blue-600", label: "Lectura", bg: "bg-sky-50 dark:bg-sky-950/20 border-sky-200 dark:border-sky-800/50" },
  evaluacion: { icon: Star, color: "from-orange-500 to-red-600", label: "Evaluación", bg: "bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/50" },
  general: { icon: CheckSquare, color: "from-zinc-500 to-gray-600", label: "Actividad", bg: "bg-zinc-50 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/50" },
};

interface Props {
  actividad: Actividad;
  index: number;
}

export function ActivityCard({ actividad, index }: Props) {
  const config = TIPO_CONFIG[actividad.tipo] || TIPO_CONFIG.general;
  const Icon = config.icon;
  const titleText = actividad.titulo.map(s => s.text).join("");
  const descText = actividad.descripcion.map(s => s.text).join("").trim();

  return (
    <div className={`rounded-xl border p-5 ${config.bg} transition-all duration-200`}>
      <div className="flex items-start gap-4">
        {/* Icon badge */}
        <div className={`flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center shadow-sm`}>
          <Icon className="h-5 w-5 text-white" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {config.label} {index + 1}
            </span>
          </div>

          {/* Title */}
          <h4 className="font-semibold text-foreground mb-2 leading-snug">
            <RichTextSpan segments={actividad.titulo} />
          </h4>

          {/* Description */}
          {descText.length > 0 && (
            <ParagraphList
              paragraphs={[actividad.descripcion]}
              className="text-sm text-foreground/80"
            />
          )}

          {/* Instructions */}
          {actividad.instrucciones && actividad.instrucciones.length > 0 && (
            <ul className="mt-3 space-y-1">
              {actividad.instrucciones.map((instr, i) => {
                const text = instr.map(s => s.text).join("").trim();
                if (!text) return null;
                return (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-current shrink-0" />
                    <RichTextSpan segments={instr} />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
