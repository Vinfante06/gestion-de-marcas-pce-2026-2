"use client";

import { useState } from "react";
import { Contacto, estadoInfo } from "@/lib/constants";
import { exportContactosToExcel } from "@/lib/exportExcel";

interface Props {
  contactos: Contacto[];
  loading: boolean;
  onEdit: (contacto: Contacto) => void;
  onDeleted: () => void;
}

function fmtFecha(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.slice(0, 10).split("-");
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

export default function RecordsTable({ contactos, loading, onEdit, onDeleted }: Props) {
  const [open, setOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string, nombre: string) {
    if (!confirm(`¿Eliminar el contacto "${nombre}"? Esta acción no se puede deshacer.`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/contactos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar");
      onDeleted();
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar el contacto.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="card">
      <div className={`records-toggle${open ? " open" : ""}`} onClick={() => setOpen(!open)}>
        <h2>Registros guardados</h2>
        <span className="chev">▶</span>
      </div>

      {open && (
        <div>
          <div className="records-header-row" style={{ marginTop: 18 }}>
            <div className="records-count">
              {loading
                ? "Cargando..."
                : `${contactos.length} ${contactos.length === 1 ? "contacto guardado" : "contactos guardados"}`}
            </div>
            <button
              type="button"
              className="secondary"
              onClick={() => exportContactosToExcel(contactos)}
              disabled={loading || contactos.length === 0}
            >
              Descargar Excel
            </button>
          </div>

          {loading ? (
            <div className="empty-state">Cargando registros...</div>
          ) : contactos.length === 0 ? (
            <div className="empty-state">Aún no hay contactos guardados.</div>
          ) : (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Teléfono</th>
                    <th>Red social</th>
                    <th>Evento</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Fecha registro</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {contactos.map((c) => {
                    const est = estadoInfo(c.estado);
                    return (
                      <tr key={c.id}>
                        <td>{c.nombre}</td>
                        <td>{c.telefono}</td>
                        <td>
                          {c.redSocial}
                          <br />
                          <span style={{ color: "var(--ink-soft)" }}>{c.usuarioRed}</span>
                        </td>
                        <td>{c.tipoEvento}</td>
                        <td>{c.categoriaMarca}</td>
                        <td>
                          <span className="badge" style={{ background: est.color }}>
                            {est.label}
                          </span>
                        </td>
                        <td>{fmtFecha(c.fechaRegistro)}</td>
                        <td>
                          <button type="button" className="edit-link" onClick={() => onEdit(c)}>
                            Editar
                          </button>
                          <button
                            type="button"
                            className="delete-link"
                            disabled={deletingId === c.id}
                            onClick={() => handleDelete(c.id, c.nombre)}
                          >
                            {deletingId === c.id ? "..." : "Eliminar"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
