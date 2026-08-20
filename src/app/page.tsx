"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Contacto } from "@/lib/constants";
import ContactForm from "@/components/ContactForm";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingContacto, setEditingContacto] = useState<Contacto | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const loadContactos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/contactos");
      const data = await res.json();
      setContactos(data.contactos || []);
      return data.contactos || [];
    } catch (err) {
      console.error("Error al cargar contactos:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContactos().then((lista: Contacto[]) => {
      const editId = searchParams.get("edit");
      if (editId) {
        const encontrado = lista.find((c) => c.id === editId);
        if (encontrado) {
          setEditingContacto(encontrado);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCancelEdit() {
    setEditingContacto(null);
    if (searchParams.get("edit")) {
      router.replace("/");
    }
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

      <NavBar />

      <div className="card">
        <ContactForm
          editingContacto={editingContacto}
          onCancelEdit={handleCancelEdit}
          onSaved={loadContactos}
        />
      </div>

      <footer className="note">
        Los datos se guardan en una base de datos Postgres. Ve a{" "}
        <Link href="/marcas" style={{ color: "var(--forest)", fontWeight: 600 }}>
          Marcas
        </Link>{" "}
        para ver y filtrar todos los contactos guardados.
      </footer>
    </div>
  );
}