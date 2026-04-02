import { useParams, Navigate, useNavigate } from "react-router-dom";
import { BookOpen, Upload, FileText, Trash2 } from "lucide-react";
import { AREA_MAP } from "@/data/areas";
import { Button } from "@/components/ui/button";
import { usePdfStore } from "@/features/cartilla/store/pdfStore";
import type { PdfDocument } from "@/features/cartilla/types";

export function AreaPage() {
  const { areaSlug } = useParams<{ areaSlug: string }>();
  const navigate = useNavigate();
  const navArea = areaSlug ? AREA_MAP[areaSlug] : undefined;
  
  const addPdf = usePdfStore((state: { addPdf: any }) => state.addPdf);
  const removePdf = usePdfStore((state: { removePdf: any }) => state.removePdf);
  const allPdfs = usePdfStore((state: { pdfs: any[] }) => state.pdfs);
  const pdfs = allPdfs.filter(p => p.areaId === areaSlug);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !areaSlug) return;
    
    // We only accept PDFs
    if (file.type !== "application/pdf") {
      alert("Por favor sube un archivo PDF válido.");
      return;
    }

    const doc = addPdf(file, areaSlug);
    navigate(`/${areaSlug}/ver/${doc.id}`);
  };

  if (!navArea) return <Navigate to="/" replace />;

  return (
    <div className="space-y-6">
      {/* Area header */}
      <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${navArea.gradientClass} p-6 md:p-8 text-white`}>
        <div className="relative z-10">
          <p className="text-white/70 text-xs uppercase tracking-widest font-semibold mb-1">Área</p>
          <h1 className="text-2xl md:text-3xl font-extrabold mb-2">{navArea.nombre}</h1>
          <p className="text-white/80 text-sm leading-relaxed max-w-lg">{navArea.descripcion}</p>
        </div>
        <BookOpen className="absolute right-6 bottom-6 h-20 w-20 text-white/10" />
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full bg-white/5" />
      </div>

      {/* Libros Interactivos */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2">
            <span className={`h-5 w-1 rounded-full ${navArea.colorClass} inline-block`} />
            Libros Interactivos (PDFs)
          </h2>
          
          <label className="cursor-pointer">
            <input 
              type="file" 
              accept=".pdf,application/pdf" 
              className="hidden" 
              onChange={handleFileUpload}
            />
            <Button asChild size="sm" variant="outline" className="gap-2 shrink-0">
              <span>
                <Upload className="h-4 w-4" /> Añadir PDF
              </span>
            </Button>
          </label>
        </div>

        {pdfs.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl border-2 border-dashed border-border/60 bg-muted/20">
            <div className={`mx-auto w-16 h-16 rounded-full bg-gradient-to-br ${navArea.gradientClass} flex items-center justify-center mb-4 opacity-50`}>
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Aún no hay PDFs en esta área</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-6">
              Sube tus libros o cartillas en formato PDF para visualizarlos con efectos de página interactivos.
            </p>
            <label className="cursor-pointer">
              <input 
                type="file" 
                accept=".pdf,application/pdf" 
                className="hidden" 
                onChange={handleFileUpload}
              />
              <Button asChild className="gap-2">
                <span>
                  <Upload className="h-4 w-4" /> Subir primer PDF
                </span>
              </Button>
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pdfs.map((pdf: PdfDocument) => (
              <div
                key={pdf.id}
                className="group flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${navArea.gradientClass} flex items-center justify-center shrink-0`}>
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate" title={pdf.name}>
                      {pdf.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Agregado el {new Date(pdf.addedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-auto">
                  <Button
                    variant="default"
                    className={`flex-1 gap-2 bg-gradient-to-r ${navArea.gradientClass} text-white hover:opacity-90`}
                    onClick={() => navigate(`/${areaSlug}/ver/${pdf.id}`)}
                  >
                    <BookOpen className="h-4 w-4" /> Leer
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 border-red-200 dark:border-red-900"
                    onClick={() => removePdf(pdf.id)}
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
