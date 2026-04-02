import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronsLeft, ChevronsRight, Home, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { usePdfStore } from "@/features/cartilla/store/pdfStore";

// ─── Mobile / Drawer content ────────────────────────────────

export const CartillaSidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const location = useLocation();
  const pdfs = usePdfStore((state) => state.pdfs);

  return (
    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
      <Link
        to="/"
        onClick={onNavigate}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
          location.pathname === "/"
            ? "bg-zinc-200/50 dark:bg-zinc-800/80 text-foreground font-semibold shadow-sm"
            : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-foreground"
        )}
      >
        <div className="flex items-center gap-3 w-full">
          <Home className="h-4 w-4 shrink-0" />
          <span>Inicio Library</span>
        </div>
      </Link>

      <div className="pt-2">
        <span className="px-3 text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
          Mis Libros
        </span>
        <div className="mt-1 space-y-0.5">
          {pdfs.length === 0 ? (
            <p className="px-3 py-2 text-xs text-muted-foreground/50 italic">
              No tienes libros agregados.
            </p>
          ) : (
            pdfs.map((pdf) => {
              const isActive = location.pathname.startsWith(`/libro/${pdf.id}`);

              return (
                <Link
                  key={pdf.id}
                  to={`/libro/${pdf.id}`}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
                    isActive
                      ? "bg-zinc-200/50 dark:bg-zinc-800/80 text-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={cn("h-2.5 w-2.5 rounded-full shrink-0 shadow-sm", pdf.colorClass)} />
                    <span className="truncate">{pdf.name}</span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </nav>
  );
};

// ─── Desktop Sidebar ────────────────────────────────────────

export const CartillaSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const pdfs = usePdfStore((state) => state.pdfs);

  const homeLink = (
    <Link
      to="/"
      className={cn(
        "flex items-center gap-3 rounded-lg text-sm transition-all duration-200 group relative",
        isCollapsed ? "px-2 py-2 justify-center" : "px-3 py-2",
        location.pathname === "/"
          ? "bg-zinc-200/50 dark:bg-zinc-800/80 text-foreground font-semibold shadow-sm"
          : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-foreground"
      )}
    >
      <Home className={cn("shrink-0 transition-colors", isCollapsed ? "h-5 w-5" : "h-4 w-4")} />
      {!isCollapsed && <span>Inicio Biblioteca</span>}
      {isCollapsed && location.pathname === "/" && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-foreground rounded-l-full" />
      )}
    </Link>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "relative hidden md:flex bg-zinc-50 dark:bg-zinc-950 h-screen flex-col transition-all duration-300 ease-in-out shrink-0 border-r border-border/40",
          isCollapsed ? "w-[68px]" : "w-64"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center transition-all duration-300 h-14 shrink-0 border-b border-border/40",
          isCollapsed ? "px-3 justify-center" : "px-5"
        )}>
          <div className="flex items-center justify-center shrink-0 w-full">
            <div className={cn("h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0 transition-all z-10", isCollapsed ? "" : "mr-3")}>
              <BookOpen className="h-4 w-4 text-white" />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-sm whitespace-nowrap overflow-hidden flex-1 leading-tight relative -translate-y-[2px]">
                Mi Biblioteca <br />
                <span className="text-muted-foreground font-normal text-xs absolute top-4 left-0">Interactiva</span>
              </span>
            )}
            {!isCollapsed && (
              <button
                onClick={() => setIsCollapsed(true)}
                className="text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted/50 p-1 ml-auto"
                title="Contraer sidebar"
              >
                <ChevronsLeft className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Expand button — visible only when collapsed, floats outside the aside */}
        {isCollapsed && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsCollapsed(false)}
                className="absolute left-[68px] top-3 z-50 text-muted-foreground hover:text-foreground transition-colors rounded-r-md bg-zinc-200/80 dark:bg-zinc-800 border border-l-0 border-border/40 py-2 pr-1.5 pl-1 shadow-sm"
                title="Expandir sidebar"
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Expandir menú</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
          {/* Portada */}
          <div className="space-y-0.5">
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>{homeLink}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}><p>Inicio Biblioteca</p></TooltipContent>
              </Tooltip>
            ) : homeLink}
          </div>

          {/* Libros agregados */}
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="px-3 text-xs font-medium text-muted-foreground/60 uppercase tracking-wider">
                Mis Libros
              </span>
            )}
            <div className="space-y-0.5">
              {pdfs.length === 0 && !isCollapsed && (
                <p className="px-3 py-2 text-xs text-muted-foreground/50 italic">
                  Añade PDFs para listarlos aquí.
                </p>
              )}
              {pdfs.map((pdf) => {
                const isActive = location.pathname.startsWith(`/libro/${pdf.id}`);

                const linkContent = (
                  <Link
                    to={`/libro/${pdf.id}`}
                    className={cn(
                      "flex items-center gap-3 rounded-lg text-sm transition-all duration-200 group relative",
                      isCollapsed ? "px-2 py-2 justify-center" : "px-3 py-2",
                      isActive
                        ? "bg-zinc-200/50 dark:bg-zinc-800/80 text-foreground font-semibold shadow-sm"
                        : "text-muted-foreground hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {isCollapsed ? (
                        <span className={cn("h-5 w-5 rounded-full shrink-0 shadow-sm", pdf.colorClass)} />
                      ) : (
                        <span className={cn("h-2.5 w-2.5 rounded-full shrink-0 shadow-sm", pdf.colorClass)} />
                      )}
                      {!isCollapsed && <span className="truncate">{pdf.name}</span>}
                    </div>

                    {isCollapsed && isActive && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-foreground rounded-l-full" />
                    )}
                  </Link>
                );

                if (isCollapsed) {
                  return (
                    <Tooltip key={pdf.id}>
                      <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                      <TooltipContent side="right" sideOffset={8}>
                        <p>{pdf.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }
                return <div key={pdf.id}>{linkContent}</div>;
              })}
            </div>
          </div>
        </nav>

        {/* Footer branding */}
        {!isCollapsed && (
          <div className="p-3 border-t border-border/40">
            <p className="text-[10px] text-muted-foreground/50 text-center px-2 truncate">
              Visor PDF Interactivo · 2026
            </p>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
};
