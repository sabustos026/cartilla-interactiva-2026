// ─── PDF Library ────────────────────────────────────────────────────────────
export type PdfDocument = {
  id: string;
  name: string;
  publicUrl: string;   // URL pública de Supabase Storage
  storagePath: string; // Ruta en el bucket para poder eliminarlo
  fileSize: number;
  addedAt: number;
  colorClass: string;  // Color asignado automáticamente para el ícono del sidebar
};
