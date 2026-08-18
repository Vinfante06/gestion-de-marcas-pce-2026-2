"use client";

import { useCallback, useEffect, useState } from "react";
import { Contacto } from "@/lib/constants";
import ContactForm from "@/components/ContactForm";
import RecordsTable from "@/components/RecordsTable";

export default function Home() {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContacto, setEditingContacto] = useState<Contacto | null>(null);

  const loadContactos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contactos");
      const data = await res.json();
      setContactos(data.contactos || []);
    } catch (err) {
      console.error("Error al cargar contactos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContactos();
  }, [loadContactos]);

  function handleEdit(contacto: Contacto) {
    setEditingContacto(contacto);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="wrap">
      <header className="hero">
        <div>
          <div className="eyebrow">Gestión de marca</div>
          <h1>
            Registro de
            <br />
            Contactos
          </h1>
        </div>
        <div className="hero-right">
          Captura y seguimiento
          <br />
          de contactos por evento
        </div>
      </header>

      <div className="card">
        <ContactForm
          editingContacto={editingContacto}
          onCancelEdit={() => setEditingContacto(null)}
          onSaved={loadContactos}
        />
      </div>

      <RecordsTable
        contactos={contactos}
        loading={loading}
        onEdit={handleEdit}
        onDeleted={loadContactos}
      />

      <footer className="note">
        Los datos se guardan en una base de datos Postgres — visibles para todos los que tengan acceso a esta app.
      </footer>
    </div>
  );
}
