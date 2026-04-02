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

// ─── Navigation ──────────────────────────────────────────────────────────────
export type NavArea = {
  id: string;
  nombre: string;
  descripcion: string;
  colorClass: string;
  gradientClass: string;
  iconName: string;
  totalUnidades: number;
};

// ─── Rich Text ───────────────────────────────────────────────────────────────
export type RichTextSegment = { text: string; bold?: boolean; italic?: boolean };
export type RichText = RichTextSegment[];

// ─── Cartilla Data ───────────────────────────────────────────────────────────
export type Actividad = {
  id: string;
  tipo: string;
  titulo: RichText;
  descripcion: RichText;
  instrucciones?: RichText[];
};

export type Leccion = {
  id: string;
  titulo: RichText;
  objetivo?: RichText;
  contenido: RichText[];
  actividades: Actividad[];
};

export type Unidad = {
  id: string;
  nombre: RichText;
  periodo?: string | number;
  grado?: string;
  lecciones: Leccion[];
};

export type Area = {
  unidades: Unidad[];
};
