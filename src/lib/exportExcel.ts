import * as XLSX from "xlsx";
import { Contacto, estadoInfo } from "./constants";

function formatFecha(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.slice(0, 10).split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export function exportContactosToExcel(contactos: Contacto[]) {
  const data = contactos.map((c) => ({
    Nombre: c.nombre,
    Teléfono: c.telefono,
    "Red social": c.redSocial,
    Usuario: c.usuarioRed,
    "Tipo de evento": c.tipoEvento,
    "Categoría de marca": c.categoriaMarca,
    Estado: estadoInfo(c.estado).label,
    "Fecha de registro": formatFecha(c.fechaRegistro),
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  ws["!cols"] = [
    { wch: 26 },
    { wch: 16 },
    { wch: 12 },
    { wch: 18 },
    { wch: 20 },
    { wch: 18 },
    { wch: 22 },
    { wch: 16 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Contactos");

  const hoy = new Date().toISOString().slice(0, 10);
  XLSX.writeFile(wb, `contactos_${hoy}.xlsx`);
}
