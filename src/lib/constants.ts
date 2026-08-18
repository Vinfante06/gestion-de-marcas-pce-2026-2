export const TIPOS_EVENTO = [
  "FWB",
  "NOCHE INT",
  "VPUD",
  "ASAMBLEAS",
  "TKP",
  "ALMUERZOS INTEGRACIÓN",
  "SOUVENIRS",
  "PADRINOS Y POLLOS",
  "PARCHADITOS",
] as const;

export const CATEGORIAS_MARCA = [
  "Snacks",
  "Postres",
  "Comida",
  "Ropa",
  "Bebidas",
  "Accesorios",
  "Almuerzos",
  "Otros",
] as const;

export const REDES_SOCIALES = [
  "Instagram",
  "WhatsApp",
  "Facebook",
  "TikTok",
  "X",
  "Otro",
] as const;

// El "value" coincide EXACTO con el enum EstadoContacto de prisma/schema.prisma
export const ESTADOS = [
  { value: "NO_ACEPTO", label: "No aceptó", color: "#D96E5C" },
  { value: "PRIMER_CONTACTO", label: "Primer contacto", color: "#E8A659" },
  { value: "ESPERANDO_REUNION", label: "Esperando reunión", color: "#E3C24A" },
  { value: "CONTRATACION_MINUTAS", label: "Contratación/minutas", color: "#7BA576" },
  { value: "YA_TRABAJO", label: "Ya trabajó con nosotros", color: "#3E6B4F" },
] as const;

export type EstadoValue = (typeof ESTADOS)[number]["value"];

export function estadoInfo(value: string) {
  return ESTADOS.find((e) => e.value === value) ?? { value, label: value, color: "#999" };
}

// Tipo del contacto tal como viaja entre el formulario y la API
export interface ContactoInput {
  nombre: string;
  telefono: string;
  redSocial: string;
  usuarioRed: string;
  tipoEvento: string;
  categoriaMarca: string;
  estado: string;
  fechaRegistro: string; // formato "YYYY-MM-DD"
}

export interface Contacto extends ContactoInput {
  id: string;
  creadoEn: string;
  actualizadoEn: string;
}
