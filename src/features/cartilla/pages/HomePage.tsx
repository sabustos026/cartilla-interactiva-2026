import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Upload, BookOpen, Trash2, FileText, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePdfStore } from "@/features/cartilla/store/pdfStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function HomePage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [bookName, setBookName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pdfs = usePdfStore((state) => state.pdfs);
  const addPdf = usePdfStore((state) => state.addPdf);
  const removePdf = usePdfStore((state) => state.removePdf);
  const loadPdfs = usePdfStore((state) => state.loadPdfs);
  const isLoading = usePdfStore((state) => state.isLoading);
  const isUploading = usePdfStore((state) => state.isUploading);

  useEffect(() => {
    loadPdfs();
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setPendingFile(file);
      setBookName(file.name.replace(/\.pdf$/i, ""));
    } else {
      alert("Por favor arrastra un archivo PDF válido.");
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPendingFile(file);
      setBookName(file.name.replace(/\.pdf$/i, ""));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveBook = async () => {
    if (pendingFile && bookName.trim()) {
      await addPdf(pendingFile, bookName.trim());
      setPendingFile(null);
      setBookName("");
    }
  };

  return (
    <div className="flex-1 p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Mi Biblioteca</h1>
          <p className="text-muted-foreground mt-1">
            Arrastra cartillas o libros en formato PDF para leerlos en el visor 3D interactivo.
          </p>
        </div>
      </div>

      {/* DROPZONE */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 text-center transition-all duration-300 overflow-hidden ${
          isDragOver
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border/60 hover:border-primary/50 bg-card hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="h-16 w-16 mb-4 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Upload className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Suelta tu libro PDF aquí</h3>
        <p className="text-muted-foreground max-w-sm mb-6">
          O haz clic para explorar los archivos de tu computadora.
        </p>
        <Button variant="outline" className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Plus className="mr-2 h-4 w-4" />
          Añadir Cartilla
        </Button>
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
        />
      </div>

      {/* LISTA DE LIBROS */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-muted-foreground" />
          Libros Recientes
        </h2>

        {isLoading ? (
          <div className="rounded-xl border border-border/80 bg-zinc-50/50 dark:bg-zinc-900/20 p-8 text-center flex flex-col items-center justify-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary opacity-60" />
            <p className="text-sm text-muted-foreground">Cargando tu biblioteca...</p>
          </div>
        ) : pdfs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/80 bg-zinc-50/50 dark:bg-zinc-900/20 p-8 text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
            <FileText className="h-8 w-8 opacity-20 mb-2" />
            No hay libros en tu biblioteca aún.<br />Usa la zona superior para agregar el primero.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {pdfs.map((pdf) => (
              <div
                key={pdf.id}
                className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-1 ${pdf.colorClass}`} />
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-white shadow-sm ${pdf.colorClass}`}>
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate leading-snug" title={pdf.name}>
                      {pdf.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                      <FileText className="h-3 w-3" />
                      {(pdf.fileSize / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <Link
                    to={`/libro/${pdf.id}`}
                    className="flex-1 text-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-md py-1.5 text-sm font-medium transition-colors shadow-sm"
                  >
                    Leer libro
                  </Link>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors h-8 w-8"
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

      {/* MODAL PARA NOMBRAR EL LIBRO */}
      <Dialog open={!!pendingFile} onOpenChange={(open) => !open && setPendingFile(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nombrar tu libro</DialogTitle>
            <DialogDescription>
              ¿Cómo deseas llamar a este libro/cartilla en tu biblioteca?
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 py-4">
            <div className="grid flex-1 gap-2">
              <label htmlFor="book-name" className="sr-only">Nombre del libro</label>
              <input
                id="book-name"
                value={bookName}
                onChange={(e) => setBookName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveBook()}
                placeholder="Ej. Cartilla de Artística 2026"
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                autoFocus
                disabled={isUploading}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button type="button" variant="secondary" onClick={() => setPendingFile(null)} disabled={isUploading}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleSaveBook} disabled={!bookName.trim() || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subiendo...
                </>
              ) : (
                "Guardar libro"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
