import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Menu, BookOpen } from "lucide-react";
import { CartillaSidebar, CartillaSidebarContent } from "./CartillaSidebar";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Breadcrumbs } from "./Breadcrumbs";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { cn } from "@/lib/utils";

export const CartillaLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isReadingMode = location.pathname.startsWith('/libro/');

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-foreground">
      {/* Desktop sidebar */}
      <CartillaSidebar />

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-72 flex flex-col
          bg-zinc-50 dark:bg-zinc-950 border-r border-border/40
          transition-transform duration-300 ease-in-out md:hidden
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="flex items-center gap-3 px-5 h-14 shrink-0 border-b border-border/40">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="font-bold text-sm leading-tight">
            Cartilla <span className="font-normal text-muted-foreground">Educativa 2026</span>
          </span>
        </div>
        <CartillaSidebarContent onNavigate={() => setMobileOpen(false)} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Header */}
        {!isReadingMode && (
          <header className="flex h-14 shrink-0 items-center px-4 gap-3 bg-zinc-50 dark:bg-zinc-950 border-b border-border/40">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted p-1.5"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" />
            </button>
            <Breadcrumbs />
            <div className="flex-1" />
            <ThemeToggle />
          </header>
        )}

        {/* Floating Mobile Menu Button for Reading Mode */}
        {isReadingMode && (
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden absolute top-3 left-4 z-50 text-muted-foreground hover:text-foreground bg-white/50 backdrop-blur-md dark:bg-black/50 transition-colors rounded-md p-2 shadow-sm border border-border/40"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}

        {/* Scrollable page content */}
        <main className={cn("flex-1 overflow-hidden", !isReadingMode && "p-2 pt-0 md:p-2 md:pt-0")}>
          <div className={cn("h-full w-full bg-white dark:bg-black overflow-y-auto", !isReadingMode && "rounded-xl border border-border/40 shadow-sm")}>
            <div className={cn("mx-auto h-full", !isReadingMode ? "max-w-5xl p-4 md:p-6 pb-20" : "w-full")}>
              <ErrorBoundary>
                <Outlet />
              </ErrorBoundary>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
