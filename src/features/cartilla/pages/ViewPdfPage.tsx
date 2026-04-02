import { useParams, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trash2 } from "lucide-react";
import { usePdfStore } from "@/features/cartilla/store/pdfStore";
import { FlipbookViewer } from "@/features/cartilla/components/FlipbookViewer";

export function ViewPdfPage() {
  const { pdfId } = useParams<{ pdfId: string }>();
  const navigate = useNavigate();
  
  const pdfs = usePdfStore((state) => state.pdfs);
  const removePdf = usePdfStore((state) => state.removePdf);
  const pdf = pdfs.find((p) => p.id === pdfId);

  if (!pdf) return <Navigate to="/" replace />;
  
  const handleDelete = () => {
    removePdf(pdf.id);
    navigate("/");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#e8e8e8] dark:bg-zinc-950/80">
      
      {/* Header específico de lectura */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-zinc-900 border-b border-border shadow-sm shrink-0 z-10 transition-colors">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={() => navigate("/")}
            title="Volver a la Biblioteca"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-full ${pdf.colorClass}`} />
            <h1 className="font-semibold text-foreground hidden sm:block">
              {pdf.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <Button
            onClick={handleDelete}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            title="Eliminar este libro de mi biblioteca"
           >
              <Trash2 className="h-4 w-4" />
           </Button>
        </div>
      </div>

      {/* Visor interactivo 3D */}
      <div className="flex-1 relative overflow-hidden">
         {/* @ts-ignore */}
         <FlipbookViewer pdfFile={pdf.publicUrl} title={pdf.name} themeColor={pdf.colorClass} />
      </div>
    </div>
  );
}
