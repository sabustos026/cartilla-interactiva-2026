import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { usePdfStore } from "@/features/cartilla/store/pdfStore";

export function Breadcrumbs() {
  const location = useLocation();
  const paths = location.pathname.split("/").filter(Boolean);
  
  const pdfStore = usePdfStore(); // Call hook here at top level

  if (paths.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="hidden sm:flex items-center text-sm">
      <ol className="flex items-center gap-1">
        <li>
          <Link
            to="/"
            className="text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center p-1 rounded-md hover:bg-muted/50"
            title="Inicio"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>

        {paths.map((path, index) => {
          const isLast = index === paths.length - 1;
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          
          let displayName = path;
          
          // Resolución de slugs legibles
          if (index === 0 && path === "libro") {
            displayName = "Biblioteca";
          } else if (index === 1 && paths[0] === "libro") {
             // Retrieve PDF name from state
             const pdfId = path;
             const pdf = pdfStore.pdfs.find((p: { id: string; name: string }) => p.id === pdfId);
             displayName = pdf ? pdf.name : "Documento PDF";
          }

          // Si es muy largo, lo truncamos
          if (displayName.length > 30) {
            displayName = displayName.substring(0, 27) + "...";
          }

          return (
            <li key={path} className="flex items-center gap-1">
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
              {isLast ? (
                <span className="font-medium text-foreground px-1 truncate max-w-[200px] md:max-w-xs block" title={path}>
                  {displayName}
                </span>
              ) : (
                <Link
                  to={href}
                  className="font-medium text-muted-foreground hover:text-foreground transition-colors px-1 truncate max-w-[150px] block"
                  title={path}
                >
                  {displayName}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
