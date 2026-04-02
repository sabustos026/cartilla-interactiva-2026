import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { CartillaLayout } from "@/components/layout/CartillaLayout";
import { HomePage } from "@/features/cartilla/pages/HomePage";
import { ViewPdfPage } from "@/features/cartilla/pages/ViewPdfPage";

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CartillaLayout />}>
          {/* Librería General */}
          <Route index element={<HomePage />} />

          {/* Visualizar PDF específico */}
          <Route path="libro/:pdfId" element={<ViewPdfPage />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
