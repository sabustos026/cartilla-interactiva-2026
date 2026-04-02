#!/usr/bin/env node
/**
 * extract-docx.mjs
 * 
 * Script para extraer el contenido completo de los archivos .docx de
 * "Cartilla interactiva" y convertirlos en archivos JSON fuertemente tipados.
 * 
 * Uso: node scripts/extract-docx.mjs
 * Requisito: mammoth debe estar instalado (ya incluido en package.json)
 */

import mammoth from "mammoth";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DOCX_DIR = path.resolve(ROOT, "..", "Cartilla interactiva");
const OUT_DIR = path.resolve(ROOT, "src", "data");

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

// ─── Mapa de archivos a IDs de área ──────────────────────────
const FILE_MAP = [
  { file: "Cartilla de artística 2026.docx",     areaId: "artistica" },
  { file: "Cartilla ética y emociones 2026.docx", areaId: "etica" },
  { file: "Cartilla Sociales Secundaria.docx",    areaId: "sociales-secundaria" },
  { file: "Cartilla sociales Básica Primaria.docx", areaId: "sociales-primaria" },
  { file: "Cátedra de paz 2026.docx",             areaId: "catedra-de-paz" },
  { file: "Religión 2026.docx",                   areaId: "religion" },
];

// ─── Helpers ─────────────────────────────────────────────────

let idCounter = 0;
function newId(prefix = "id") {
  return `${prefix}_${++idCounter}`;
}

/**
 * Convierte una lista de runs de mammoth en RichText
 * @param {Array} runs - Lista de runs con text y bold
 * @returns {Array<{text: string, bold: boolean}>}
 */
function runsToRichText(runs) {
  return runs
    .filter(r => r.value && r.value.trim().length > 0)
    .map(r => ({ text: r.value, bold: !!r.bold }));
}

/**
 * Detecta el nivel de un párrafo basado en su estilo
 */
function getLevel(para) {
  const style = (para.styleId || "").toLowerCase();
  const name = (para.styleName || "").toLowerCase();
  if (style.includes("heading1") || name.includes("heading 1")) return 1;
  if (style.includes("heading2") || name.includes("heading 2")) return 2;
  if (style.includes("heading3") || name.includes("heading 3")) return 3;
  if (style.includes("heading4") || name.includes("heading 4")) return 4;
  return 0; // body text
}

/**
 * Detecta si un párrafo es del tipo actividad
 */
function isActividadTitle(text) {
  const lw = text.toLowerCase();
  return (
    lw.startsWith("actividad") ||
    lw.startsWith("tarea") ||
    lw.startsWith("quiz") ||
    lw.startsWith("reflexi") ||
    lw.startsWith("evaluaci") ||
    lw.startsWith("ejercicio")
  );
}

/**
 * Infiere el tipo de actividad desde el texto
 */
function inferTipoActividad(text) {
  const lw = text.toLowerCase();
  if (lw.includes("quiz") || lw.includes("pregunta")) return "quiz";
  if (lw.includes("reflexi")) return "reflexion";
  if (lw.includes("tarea")) return "tarea";
  if (lw.includes("creativ") || lw.includes("crea") || lw.includes("dibuj") || lw.includes("pint")) return "creativa";
  if (lw.includes("investiga")) return "investigacion";
  if (lw.includes("lectura") || lw.includes("lee")) return "lectura";
  if (lw.includes("evaluaci") || lw.includes("examen")) return "evaluacion";
  return "general";
}

/**
 * Construye un array de RichText a partir de texto plano
 */
function plainToRichText(text, bold = false) {
  if (!text || !text.trim()) return [];
  return [{ text: text.trim(), bold }];
}

// ─── Procesamiento principal ─────────────────────────────────

async function processDocx(docxPath, areaId) {
  console.log(`\n📄 Procesando: ${path.basename(docxPath)}`);

  let rawResult;
  try {
    rawResult = await mammoth.extractRawText({ path: docxPath });
  } catch (err) {
    console.error(`  ❌ Error leyendo archivo: ${err.message}`);
    return null;
  }

  // Intentar extraer con messages para HTML estructurado
  let htmlResult;
  try {
    htmlResult = await mammoth.convertToHtml({ path: docxPath });
    if (htmlResult.messages.length > 0) {
      console.log(`  ⚠️  ${htmlResult.messages.length} mensaje(s) de conversión`);
    }
  } catch (err) {
    console.warn(`  ⚠️ No se pudo obtener HTML, usando texto plano: ${err.message}`);
  }

  // Parsear el texto extraído en estructura jerárquica
  const lines = rawResult.value.split("\n").map(l => l.trim()).filter(l => l.length > 0);

  console.log(`  📝 ${lines.length} líneas extraídas`);

  const unidades = [];
  let currentUnidad = null;
  let currentLeccion = null;
  let currentActividad = null;
  let bodyBuffer = [];

  const flushBuffer = () => {
    if (bodyBuffer.length === 0) return;
    const richParagraphs = bodyBuffer.map(t => plainToRichText(t));
    if (currentActividad) {
      currentActividad.descripcion = [
        ...currentActividad.descripcion,
        ...richParagraphs.flat(),
      ];
    } else if (currentLeccion) {
      currentLeccion.contenido.push(...richParagraphs);
    }
    bodyBuffer = [];
  };

  const flushActividad = () => {
    flushBuffer();
    if (currentActividad && currentLeccion) {
      currentLeccion.actividades.push(currentActividad);
      currentActividad = null;
    }
  };

  const flushLeccion = () => {
    flushActividad();
    if (currentLeccion && currentUnidad) {
      currentUnidad.lecciones.push(currentLeccion);
      currentLeccion = null;
    }
  };

  const flushUnidad = () => {
    flushLeccion();
    if (currentUnidad) {
      unidades.push(currentUnidad);
      currentUnidad = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Heurística: detectar headings por longitud y contexto
    // Las líneas cortas en mayúsculas o con patrón periódico suelen ser encabezados
    const isAllCaps = line === line.toUpperCase() && line.length > 3 && /[A-ZÁÉÍÓÚÑ]/.test(line);
    const isPeriodHeader = /^(periodo|period|unidad|unit|grado|bimestre|trimestre)\s*\d*/i.test(line);
    const isLeccionHeader = /^(tema|lección|leccion|sección|seccion|capítulo|capitulo)\s*\d*/i.test(line);
    const isShortHeader = line.length < 80 && (isAllCaps || isPeriodHeader);

    if (isPeriodHeader || (isAllCaps && line.length < 60 && !currentUnidad)) {
      // Nuevo período / unidad
      flushUnidad();
      currentUnidad = {
        id: newId("unidad"),
        nombre: plainToRichText(line, true),
        periodo: extractNumber(line),
        grado: extractGrado(line),
        descripcion: [],
        lecciones: [],
      };
    } else if (isLeccionHeader || (isShortHeader && currentUnidad && line !== lines[i - 1])) {
      // Nueva lección dentro de la unidad actual
      if (!currentUnidad) {
        currentUnidad = {
          id: newId("unidad"),
          nombre: plainToRichText("General", true),
          lecciones: [],
        };
      }
      flushLeccion();
      currentLeccion = {
        id: newId("leccion"),
        titulo: plainToRichText(line, true),
        objetivo: undefined,
        contenido: [],
        actividades: [],
      };
    } else if (isActividadTitle(line)) {
      // Nueva actividad
      if (!currentLeccion) {
        if (!currentUnidad) {
          currentUnidad = { id: newId("unidad"), nombre: plainToRichText("General", true), lecciones: [] };
        }
        currentLeccion = { id: newId("leccion"), titulo: plainToRichText("General", true), contenido: [], actividades: [] };
      }
      flushActividad();
      currentActividad = {
        id: newId("act"),
        tipo: inferTipoActividad(line),
        titulo: plainToRichText(line, true),
        descripcion: [],
        instrucciones: [],
      };
    } else if (line.toLowerCase().startsWith("objetivo")) {
      // Objetivo de lección
      flushBuffer();
      if (currentLeccion) {
        currentLeccion.objetivo = plainToRichText(line);
      }
    } else {
      // Contenido de cuerpo
      bodyBuffer.push(line);
    }
  }

  // Flush final
  flushUnidad();

  // Si no se detectó ninguna unidad, crear una por defecto
  if (unidades.length === 0 && lines.length > 0) {
    const defaultLeccion = {
      id: newId("leccion"),
      titulo: plainToRichText("Contenido General", true),
      contenido: lines.map(l => plainToRichText(l)),
      actividades: [],
    };
    unidades.push({
      id: newId("unidad"),
      nombre: plainToRichText("Contenido del Área", true),
      lecciones: [defaultLeccion],
    });
  }

  console.log(`  ✅ ${unidades.length} unidad(es) | ${unidades.reduce((s, u) => s + u.lecciones.length, 0)} lección(es)`);

  return { id: areaId, unidades };
}

function extractNumber(text) {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : undefined;
}

function extractGrado(text) {
  const match = text.match(/(\d+)[°ºo]\s*(grado|grade)?/i);
  return match ? `${match[1]}°` : undefined;
}

// ─── MAIN ────────────────────────────────────────────────────

async function main() {
  console.log("🚀 Extractor de Cartilla Interactiva 2026");
  console.log("==========================================");
  console.log(`📁 Fuente: ${DOCX_DIR}`);
  console.log(`📂 Destino: ${OUT_DIR}\n`);

  let processed = 0;

  for (const { file, areaId } of FILE_MAP) {
    const docxPath = path.join(DOCX_DIR, file);
    if (!fs.existsSync(docxPath)) {
      console.warn(`⚠️  Archivo no encontrado: ${file}`);
      continue;
    }

    const result = await processDocx(docxPath, areaId);
    if (!result) continue;

    const outPath = path.join(OUT_DIR, `${areaId}.json`);
    fs.writeFileSync(outPath, JSON.stringify(result, null, 2), "utf-8");
    console.log(`  💾 Guardado: src/data/${areaId}.json`);
    processed++;
  }

  console.log(`\n✅ Extracción completada: ${processed}/${FILE_MAP.length} archivos procesados`);
}

main().catch((err) => {
  console.error("❌ Error fatal:", err);
  process.exit(1);
});
