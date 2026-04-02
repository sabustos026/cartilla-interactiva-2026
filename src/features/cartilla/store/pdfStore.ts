import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import type { PdfDocument } from "@/features/cartilla/types";

const COLORS = [
  "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-rose-500",
  "bg-amber-500", "bg-emerald-500", "bg-teal-500", "bg-indigo-500"
];

interface PdfStore {
  pdfs: PdfDocument[];
  isLoading: boolean;
  isUploading: boolean;
  loadPdfs: () => Promise<void>;
  addPdf: (file: File, name: string) => Promise<PdfDocument | null>;
  removePdf: (id: string) => Promise<void>;
}

export const usePdfStore = create<PdfStore>((set, get) => ({
  pdfs: [],
  isLoading: false,
  isUploading: false,

  loadPdfs: async () => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from("pdf_books")
      .select("*")
      .order("added_at", { ascending: false });

    if (error) {
      console.error("Error cargando PDFs:", error.message);
      set({ isLoading: false });
      return;
    }

    const pdfs: PdfDocument[] = (data ?? []).map((row: any) => ({
      id: row.id,
      name: row.name,
      publicUrl: row.public_url,
      storagePath: row.storage_path,
      fileSize: row.file_size ?? 0,
      addedAt: new Date(row.added_at).getTime(),
      colorClass: row.color_class,
    }));

    set({ pdfs, isLoading: false });
  },

  addPdf: async (file: File, name: string) => {
    set({ isUploading: true });

    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const safeFileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
    const storagePath = `books/${safeFileName}`;

    // 1. Subir archivo a Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(storagePath, file, { contentType: "application/pdf", upsert: false });

    if (uploadError) {
      console.error("Error subiendo PDF:", uploadError.message);
      set({ isUploading: false });
      return null;
    }

    // 2. Obtener URL pública
    const { data: urlData } = supabase.storage
      .from("pdfs")
      .getPublicUrl(storagePath);

    const publicUrl = urlData.publicUrl;

    // 3. Insertar metadatos en la base de datos
    const { data: insertData, error: insertError } = await supabase
      .from("pdf_books")
      .insert({
        name: name.trim() || file.name.replace(/\.pdf$/i, ""),
        storage_path: storagePath,
        public_url: publicUrl,
        file_size: file.size,
        color_class: randomColor,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error guardando metadatos:", insertError.message);
      set({ isUploading: false });
      return null;
    }

    const newPdf: PdfDocument = {
      id: insertData.id,
      name: insertData.name,
      publicUrl: insertData.public_url,
      storagePath: insertData.storage_path,
      fileSize: insertData.file_size,
      addedAt: new Date(insertData.added_at).getTime(),
      colorClass: insertData.color_class,
    };

    set((state) => ({
      pdfs: [newPdf, ...state.pdfs],
      isUploading: false,
    }));

    return newPdf;
  },

  removePdf: async (id: string) => {
    const pdf = get().pdfs.find((p) => p.id === id);
    if (!pdf) return;

    // 1. Eliminar de Storage
    await supabase.storage.from("pdfs").remove([pdf.storagePath]);

    // 2. Eliminar de la base de datos
    await supabase.from("pdf_books").delete().eq("id", id);

    set((state) => ({
      pdfs: state.pdfs.filter((p) => p.id !== id),
    }));
  },
}));

