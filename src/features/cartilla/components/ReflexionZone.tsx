import { useState } from "react";
import { Send, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  prompt?: string;
  areaGradient?: string;
}

export function ReflexionZone({ prompt = "¿Qué aprendiste en esta lección? ¿Cómo puedes aplicarlo en tu vida diaria?", areaGradient = "from-amber-500 to-yellow-600" }: Props) {
  const [text, setText] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (text.trim().length < 10) return;
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="rounded-2xl border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-950/10 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${areaGradient} px-5 py-3 flex items-center gap-2`}>
        <Lightbulb className="h-4 w-4 text-white" />
        <span className="text-sm font-bold text-white">Zona de Reflexión</span>
      </div>

      <div className="p-5 space-y-3">
        <p className="text-sm text-foreground/80 font-medium leading-relaxed">{prompt}</p>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe tu reflexión aquí..."
          rows={4}
          className="w-full resize-none rounded-xl border border-border/60 bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-amber-400/40 transition-all"
        />

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {text.length} caracteres
          </span>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={text.trim().length < 10}
            className={`gap-2 transition-all duration-300 ${saved ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
          >
            {saved ? "✓ ¡Guardado!" : (<><Send className="h-3.5 w-3.5" /> Guardar reflexión</>)}
          </Button>
        </div>
      </div>
    </div>
  );
}
