import type { NavArea } from "@/features/cartilla/types";

/** Mapa central de todas las áreas educativas de la cartilla */
export const AREAS: NavArea[] = [
  {
    id: "artistica",
    nombre: "Artística",
    descripcion: "Expresión plástica, música, teatro y apreciación del arte",
    colorClass: "bg-violet-500",
    gradientClass: "from-violet-500 to-indigo-600",
    iconName: "Palette",
    totalUnidades: 0,
  },
  {
    id: "etica",
    nombre: "Ética y Emociones",
    descripcion: "Valores, emociones, convivencia y desarrollo personal",
    colorClass: "bg-emerald-500",
    gradientClass: "from-emerald-500 to-teal-600",
    iconName: "Heart",
    totalUnidades: 0,
  },
  {
    id: "sociales-secundaria",
    nombre: "Sociales Secundaria",
    descripcion: "Ciencias Sociales para básica secundaria y media",
    colorClass: "bg-amber-500",
    gradientClass: "from-amber-500 to-orange-600",
    iconName: "Globe",
    totalUnidades: 0,
  },
  {
    id: "sociales-primaria",
    nombre: "Sociales Primaria",
    descripcion: "Ciencias Sociales para básica primaria",
    colorClass: "bg-sky-500",
    gradientClass: "from-sky-500 to-blue-600",
    iconName: "MapPin",
    totalUnidades: 0,
  },
  {
    id: "catedra-de-paz",
    nombre: "Cátedra de Paz",
    descripcion: "Educación para la paz, convivencia y resolución de conflictos",
    colorClass: "bg-rose-500",
    gradientClass: "from-rose-500 to-pink-600",
    iconName: "Handshake",
    totalUnidades: 0,
  },
  {
    id: "religion",
    nombre: "Religión",
    descripcion: "Educación religiosa y valores espirituales",
    colorClass: "bg-purple-500",
    gradientClass: "from-purple-500 to-fuchsia-600",
    iconName: "BookOpen",
    totalUnidades: 0,
  },
];

export const AREA_MAP: Record<string, NavArea> = Object.fromEntries(
  AREAS.map((a) => [a.id, a])
);
