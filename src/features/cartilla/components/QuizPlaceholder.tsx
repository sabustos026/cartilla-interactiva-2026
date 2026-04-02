import { useState } from "react";
import { CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SAMPLE_QUESTIONS = [
  {
    question: "¿Cuál es el objetivo principal de esta lección?",
    options: ["Comprender el concepto", "Memorizar datos", "Ambas opciones", "Ninguna"],
    correct: 0,
  },
  {
    question: "¿Cuántas fases tiene el proceso aprendido?",
    options: ["Dos", "Tres", "Cuatro", "Cinco"],
    correct: 1,
  },
];

interface Props {
  areaColor?: string;
  areaGradient?: string;
  customQuestions?: Array<{ question: string; options: string[]; correct: number }>;
}

export function QuizPlaceholder({ areaColor = "bg-violet-500", areaGradient = "from-violet-500 to-indigo-600", customQuestions }: Props) {
  const questions = customQuestions || SAMPLE_QUESTIONS;
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const q = questions[current];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === q.correct) setScore(s => s + 1);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const handleRetry = () => {
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="rounded-2xl border border-border/60 overflow-hidden bg-card shadow-sm">
      {/* Header */}
      <div className={`bg-gradient-to-r ${areaGradient} px-5 py-3 flex items-center justify-between`}>
        <span className="text-sm font-bold text-white">📝 Quiz de Comprensión</span>
        <Badge variant="secondary" className="bg-white/20 text-white border-0 text-xs">
          {current + 1} / {questions.length}
        </Badge>
      </div>

      <div className="p-5">
        {finished ? (
          <div className="text-center py-6 space-y-3">
            <div className={`mx-auto h-16 w-16 rounded-full bg-gradient-to-br ${areaGradient} flex items-center justify-center`}>
              <span className="text-2xl text-white font-bold">{score}/{questions.length}</span>
            </div>
            <p className="font-semibold text-foreground">
              {score === questions.length ? "¡Excelente! Respondiste todo correctamente 🎉" :
               score >= questions.length / 2 ? "¡Buen trabajo! Sigue practicando 💪" :
               "¡Sigue intentando! Puedes mejorar 📚"}
            </p>
            <Button variant="outline" size="sm" onClick={handleRetry} className="gap-2">
              <RotateCcw className="h-3.5 w-3.5" /> Intentar de nuevo
            </Button>
          </div>
        ) : (
          <>
            <p className="font-medium text-foreground mb-4 leading-relaxed">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => {
                let btnClass = "w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ";
                if (selected === null) {
                  btnClass += "border-border/60 hover:border-primary/40 hover:bg-muted/40 cursor-pointer";
                } else if (i === q.correct) {
                  btnClass += "border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400";
                } else if (i === selected) {
                  btnClass += "border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400";
                } else {
                  btnClass += "border-border/40 opacity-60";
                }
                return (
                  <button key={i} className={btnClass} onClick={() => handleSelect(i)}>
                    <span className="flex items-center gap-2">
                      {showResult && i === q.correct && <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />}
                      {showResult && i === selected && i !== q.correct && <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>
            {showResult && (
              <div className="mt-4 flex justify-end">
                <Button size="sm" onClick={handleNext}>
                  {current + 1 >= questions.length ? "Ver resultado" : "Siguiente →"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
