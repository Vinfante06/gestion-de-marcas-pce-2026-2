"use client";

import { useEffect, useState } from "react";
import {
  TIPOS_EVENTO,
  CATEGORIAS_MARCA,
  REDES_SOCIALES,
  Contacto,
  ContactoInput,
} from "@/lib/constants";
import EstadoPipeline from "./EstadoPipeline";

const emptyForm: ContactoInput = {
  nombre: "",
  telefono: "",
  redSocial: "",
  usuarioRed: "",
  tipoEvento: "",
  categoriaMarca: "",
  estado: "",
  fechaRegistro: "",
};

function todayISO() {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 10);
}

interface Props {
  editingContacto: Contacto | null;
  onCancelEdit: () => void;
  onSaved: () => void; // se llama después de crear o actualizar con éxito
}

export default function ContactForm({ editingContacto, onCancelEdit, onSaved }: Props) {
  const [form, setForm] = useState<ContactoInput>({ ...emptyForm, fechaRegistro: todayISO() });
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; error: boolean } | null>(null);

  // Cuando se selecciona "Editar" en la tabla, precargamos el formulario
  useEffect(() => {
    if (editingContacto) {
      setForm({
        nombre: editingContacto.nombre,
        telefono: editingContacto.telefono,
        redSocial: editingContacto.redSocial,
        usuarioRed: editingContacto.usuarioRed,
        tipoEvento: editingContacto.tipoEvento,
        categoriaMarca: editingContacto.categoriaMarca,
        estado: editingContacto.estado,
        fechaRegistro: editingContacto.fechaRegistro.slice(0, 10),
      });
      setStatusMsg(null);
    }
  }, [editingContacto]);

  function resetForm() {
    setForm({ ...emptyForm, fechaRegistro: todayISO() });
  }

  function handleCancelEdit() {
    resetForm();
    onCancelEdit();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);

    if (!form.estado) {
      setStatusMsg({ text: "Selecciona un estado del contacto.", error: true });
      return;
    }

    setSaving(true);
    try {
      const isEdit = !!editingContacto;
      const url = isEdit ? `/api/contactos/${editingContacto!.id}` : "/api/contactos";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Error al guardar");
      }

      setStatusMsg({
        text: isEdit ? "Contacto actualizado correctamente." : "Contacto guardado correctamente.",
        error: false,
      });
      resetForm();
      onCancelEdit(); // limpia el modo edición
      onSaved(); // recarga la tabla
    } catch (err) {
      console.error(err);
      setStatusMsg({ text: "No se pudo guardar. Intenta de nuevo.", error: true });
    } finally {
      setSaving(false);
    }
  }

  const isEdit = !!editingContacto;

  return (
    <form onSubmit={handleSubmit}>
      {isEdit && (
        <div className="editing-banner">
          <span>Editando contacto: {editingContacto!.nombre}</span>
          <button type="button" onClick={handleCancelEdit}>
            Cancelar edición
          </button>
        </div>
      )}

      <div className="field">
        <label htmlFor="nombre">
          Nombre completo <span className="required">*</span>
        </label>
        <input
          id="nombre"
          type="text"
          className="uppercase-field"
          placeholder="EJ. MARIA CAMILA GÓMEZ"
          required
          autoComplete="off"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value.toUpperCase() })}
        />
        <div className="hint">Se guarda automáticamente en mayúsculas.</div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="telefono">
            Teléfono <span className="required">*</span>
          </label>
          <input
            id="telefono"
            type="tel"
            placeholder="300 000 0000"
            required
            value={form.telefono}
            onChange={(e) => setForm({ ...form, telefono: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="fechaRegistro">
            Fecha de registro de la marca <span className="required">*</span>
          </label>
          <input
            id="fechaRegistro"
            type="date"
            required
            value={form.fechaRegistro}
            onChange={(e) => setForm({ ...form, fechaRegistro: e.target.value })}
          />
        </div>
      </div>

      <div className="field">
        <label>
          Red social <span className="required">*</span>
        </label>
        <div className="contact-social">
          <select
            required
            value={form.redSocial}
            onChange={(e) => setForm({ ...form, redSocial: e.target.value })}
          >
            <option value="" disabled>
              Elegir
            </option>
            {REDES_SOCIALES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="@usuario"
            required
            value={form.usuarioRed}
            onChange={(e) => setForm({ ...form, usuarioRed: e.target.value })}
          />
        </div>
      </div>

      <div className="row2">
        <div className="field">
          <label htmlFor="tipoEvento">
            Tipo de evento <span className="required">*</span>
          </label>
          <select
            id="tipoEvento"
            required
            value={form.tipoEvento}
            onChange={(e) => setForm({ ...form, tipoEvento: e.target.value })}
          >
            <option value="" disabled>
              Seleccionar evento
            </option>
            {TIPOS_EVENTO.map((ev) => (
              <option key={ev} value={ev}>
                {ev}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="categoriaMarca">
            Categoría de marca <span className="required">*</span>
          </label>
          <select
            id="categoriaMarca"
            required
            value={form.categoriaMarca}
            onChange={(e) => setForm({ ...form, categoriaMarca: e.target.value })}
          >
            <option value="" disabled>
              Seleccionar categoría
            </option>
            {CATEGORIAS_MARCA.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label>
          Estado del contacto <span className="required">*</span>
        </label>
        <EstadoPipeline
          value={form.estado || null}
          onChange={(v) => setForm({ ...form, estado: v })}
        />
      </div>

      <div className="submit-row">
        <button type="submit" className="primary" disabled={saving}>
          {saving ? (isEdit ? "Actualizando..." : "Guardando...") : isEdit ? "Actualizar contacto" : "Guardar contacto"}
        </button>
        {statusMsg && (
          <span className={`status-msg${statusMsg.error ? " error" : ""}`}>{statusMsg.text}</span>
        )}
      </div>
    </form>
  );
}
