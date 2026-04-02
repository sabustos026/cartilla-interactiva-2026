import { useState, useRef, useEffect, forwardRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import HTMLFlipBook from "react-pageflip";
import {
  ZoomIn, ZoomOut, Maximize, ChevronLeft, ChevronRight, Share2, Printer, LayoutGrid, FileText, Search, MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Configurar el worker de PDF.js de forma 100% segura usando un CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface Props {
  pdfFile: File | string; // Acepta objeto File (local) o URL pública (Supabase Storage)
}

// Wrapper for the page to be used with react-pageflip
const PageWrapper = forwardRef<HTMLDivElement, { pageNumber: number; scale: number; width?: number; height?: number; onLoadError?: () => void }>(
  ({ pageNumber, scale, width, height, onLoadError }, ref) => {
    // Para dar realismo, añadimos una sombra sutil en el borde derecho que simula la curvatura hacia el centro del libro.
    return (
      <div ref={ref} className="page bg-white flex items-center justify-center overflow-hidden border-r border-black/5 shadow-[inset_-15px_0_20px_-15px_rgba(0,0,0,0.15)] relative">
        <Page
          pageNumber={pageNumber}
          scale={scale}
          width={width}
          height={height}
          loading={<Skeleton className="w-full h-full" />}
          error={<div className="text-red-500 p-4 text-center">Error loading page {pageNumber}</div>}
          onLoadError={onLoadError}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
      </div>
    );
  }
);
PageWrapper.displayName = "PageWrapper";

export function FlipbookViewer({ pdfFile }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState<number>(0); // 0-indexed in flipbook
  const [scale, setScale] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const bookRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const nextButtonClick = () => {
    if (bookRef.current) bookRef.current.pageFlip().flipNext();
  };

  const prevButtonClick = () => {
    if (bookRef.current) bookRef.current.pageFlip().flipPrev();
  };

  const onPage = (e: any) => {
    setPage(e.data); // e.data contains the new target page 0-index
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const zoomIn = () => setScale(s => Math.min(s + 0.2, 3));
  const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.6));

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      // Auto-scale up on fullscreen and down when exit
      if (document.fullscreenElement) {
        setScale(1.2);
      } else {
        setScale(1);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  // Compute book dimensions
  const bookWidth = 450;
  const bookHeight = 600;

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full min-h-[80vh] flex flex-col bg-[#e8e8e8] dark:bg-zinc-950/80 rounded-2xl overflow-hidden ${isFullscreen ? "fixed inset-0 z-50 rounded-none bg-[#e8e8e8]" : ""}`}
    >
      <Document
        file={pdfFile}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={(error) => console.error("PDF.js Error fatal:", error)}
        loading={
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-muted-foreground">
            <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-primary animate-spin" />
            <p className="font-medium animate-pulse">Analizando documento PDF...</p>
          </div>
        }
        error={
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4">
            <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500 mb-2">
              <FileText className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold text-foreground">Error al cargar el PDF</h3>
            <p className="text-sm text-muted-foreground w-full max-w-sm mx-auto">
              Asegúrate de que el archivo no esté corrupto y sea un PDF válido.
            </p>
          </div>
        }
        className="flex-1 flex items-center justify-center w-full relative overflow-y-auto overflow-x-hidden p-4 md:p-8 pb-32"
      >
        {numPages > 0 && (
          <div className="relative" style={{ transform: `scale(${scale})`, transformOrigin: "center center", transition: "transform 0.3s ease-out" }}>
            {/* The flipbook container must be unstyled so it can calculate properly */}
            <div className="shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] ring-1 ring-black/5">
              {/* @ts-ignore react-pageflip types are incomplete */}
              <HTMLFlipBook 
                width={bookWidth}
                height={bookHeight}
                size="fixed"
                minWidth={300}
                maxWidth={bookWidth}
                minHeight={400}
                maxHeight={bookHeight}
                maxShadowOpacity={0.5}
                showCover={true}
                mobileScrollSupport={true}
                onFlip={onPage}
                className="flipbook-component mx-auto"
                ref={bookRef}
                usePortrait={false} // Force 2 pages!
              >
                {Array.from(new Array(numPages)).map((_, index) => (
                  <PageWrapper 
                    key={`page_${index + 1}`} 
                    pageNumber={index + 1} 
                    scale={1} 
                    width={bookWidth}
                    height={bookHeight}
                  />
                ))}
              </HTMLFlipBook>
            </div>

            {/* Float Arrows */}
            <button
              onClick={prevButtonClick}
              className={`absolute top-1/2 -left-16 md:-left-20 xl:-left-24 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white dark:bg-zinc-800 shadow-[0_4px_20px_-3px_rgba(0,0,0,0.12)] flex items-center justify-center text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all ${page === 0 ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:scale-110 hover:-translate-x-1"}`}
              disabled={page === 0}
            >
              <ChevronLeft className="h-6 w-6 text-zinc-600 dark:text-zinc-300" />
            </button>
            <button
              onClick={nextButtonClick}
              className={`absolute top-1/2 -right-16 md:-right-20 xl:-right-24 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-white dark:bg-zinc-800 shadow-[0_4px_20px_-3px_rgba(0,0,0,0.12)] flex items-center justify-center text-foreground hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all ${page >= numPages - 1 ? "opacity-30 cursor-not-allowed" : "cursor-pointer hover:scale-110 hover:translate-x-1"}`}
              disabled={page >= numPages - 1}
            >
              <ChevronRight className="h-6 w-6 text-zinc-600 dark:text-zinc-300" />
            </button>
          </div>
        )}
      </Document>

      {/* Floating Bottom Toolbar matching the screenshot style */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1 sm:gap-2 px-4 py-2 bg-white dark:bg-zinc-900 rounded-lg shadow-[0_4px_20px_-2px_rgba(0,0,0,0.15)] ring-1 ring-black/5 z-10 transition-colors">
        
        {/* Page Counter Indicator */}
        <div className="flex items-center gap-1 text-sm font-medium px-2 py-1 mr-2 text-zinc-500 dark:text-zinc-400 border-r border-zinc-200 dark:border-zinc-800 pr-4">
          <span>{numPages > 0 ? page + 1 : 0}</span>
          <span className="opacity-70">/</span>
          <span>{numPages}</span>
        </div>

        {/* Action Buttons */}
        <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 rounded-md" title="Vista Cuadrícula">
          <LayoutGrid className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={zoomIn} className="h-9 w-9 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 rounded-md" title="Acercar">
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={zoomOut} className="h-9 w-9 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 rounded-md" title="Alejar">
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleFullscreen} className="h-9 w-9 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 rounded-md" title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}>
          <Maximize className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 rounded-md" title="Compartir">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 rounded-md" title="Buscar">
          <Search className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 rounded-md" title="Imprimir">
          <Printer className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800 rounded-md" title="Más opciones">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
