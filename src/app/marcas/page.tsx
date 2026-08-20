"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Contacto,
    TIPOS_EVENTO,
    CATEGORIAS_MARCA,
    ESTADOS,
    estadoInfo,
} from "@/lib/constants";
import { exportContactosToExcel } from "@/lib/exportExcel";
import NavBar from "@/components/NavBar";

function fmtFecha(iso: string) {
    if (!iso) return "";
    const [y, m, d] = iso.slice(0, 10).split("-");
    if (!y || !m || !d) return iso;
    return `${d}/${m}/${y}`;
}

export default function MarcasPage() {
    const [contactos, setContactos] = useState<Contacto[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const router = useRouter();

    const [busqueda, setBusqueda] = useState("");
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [filtroEvento, setFiltroEvento] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");

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

    const filtrados = useMemo(() => {
        const q = busqueda.trim().toUpperCase();
        return contactos.filter((c) => {
            if (q && !c.nombre.includes(q) && !c.usuarioRed.toUpperCase().includes(q)) return false;
            if (filtroCategoria && c.categoriaMarca !== filtroCategoria) return false;
            if (filtroEvento && c.tipoEvento !== filtroEvento) return false;
            if (filtroEstado && c.estado !== filtroEstado) return false;
            return true;
        });
    }, [contactos, busqueda, filtroCategoria, filtroEvento, filtroEstado]);

    // Agrupadas por categoría de marca para que la vista se sienta organizada "por marca"
    const grupos = useMemo(() => {
        const map = new Map<string, Contacto[]>();
        for (const c of filtrados) {
            const key = c.categoriaMarca || "Sin categoría";
            if (!map.has(key)) map.set(key, []);
            map.get(key)!.push(c);
        }
        return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
    }, [filtrados]);

    const hayFiltrosActivos = !!(busqueda || filtroCategoria || filtroEvento || filtroEstado);

    function limpiarFiltros() {
        setBusqueda("");
        setFiltroCategoria("");
        setFiltroEvento("");
        setFiltroEstado("");
    }

    function handleEdit(id: string) {
        router.push(`/?edit=${id}`);
    }

    async function handleDelete(id: string, nombre: string) {
        if (!confirm(`¿Eliminar el contacto "${nombre}"? Esta acción no se puede deshacer.`)) return;
        setDeletingId(id);
        try {
            const res = await fetch(`/api/contactos/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("No se pudo eliminar");
            await loadContactos();
        } catch (err) {
            console.error(err);
            alert("No se pudo eliminar el contacto.");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="wrap">
            <header className="hero">
                <div>
                    <div className="eyebrow">Gestión de marca</div>
                    <h1>Marcas</h1>
                </div>
                <div className="hero-right">
                    Explora y filtra
                    <br />
                    los contactos guardados
                </div>
            </header>

            <NavBar />

            <div className="card">
                <div className="filters-row">
                    <div className="field">
                        <label htmlFor="busqueda">Buscar</label>
                        <input
                            id="busqueda"
                            type="text"
                            placeholder="Nombre o usuario..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="filtroCategoria">Categoría</label>
                        <select
                            id="filtroCategoria"
                            value={filtroCategoria}
                            onChange={(e) => setFiltroCategoria(e.target.value)}
                        >
                            <option value="">Todas</option>
                            {CATEGORIAS_MARCA.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="filtroEvento">Evento</label>
                        <select
                            id="filtroEvento"
                            value={filtroEvento}
                            onChange={(e) => setFiltroEvento(e.target.value)}
                        >
                            <option value="">Todos</option>
                            {TIPOS_EVENTO.map((ev) => (
                                <option key={ev} value={ev}>
                                    {ev}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="filtroEstado">Estado</label>
                        <select
                            id="filtroEstado"
                            value={filtroEstado}
                            onChange={(e) => setFiltroEstado(e.target.value)}
                        >
                            <option value="">Todos</option>
                            {ESTADOS.map((e) => (
                                <option key={e.value} value={e.value}>
                                    {e.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="records-header-row">
                    <div className="records-count">
                        {loading
                            ? "Cargando..."
                            : `${filtrados.length} de ${contactos.length} contactos`}
                        {hayFiltrosActivos && (
                            <button type="button" onClick={limpiarFiltros} style={{ marginLeft: 10 }}>
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                    <button
                        type="button"
                        className="secondary"
                        onClick={() => exportContactosToExcel(filtrados)}
                        disabled={loading || filtrados.length === 0}
                    >
                        Descargar Excel
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="card">
                    <div className="empty-state">Cargando registros...</div>
                </div>
            ) : filtrados.length === 0 ? (
                <div className="card">
                    <div className="empty-state">
                        {contactos.length === 0
                            ? "Aún no hay marcas registradas."
                            : "Ningún contacto coincide con los filtros."}
                    </div>
                </div>
            ) : (
                <div className="brand-groups">
                    {grupos.map(([categoria, lista]) => (
                        <div className="card" key={categoria}>
                            <div className="brand-group-title">
                                {categoria}
                                <span className="brand-group-count">
                                    {lista.length} {lista.length === 1 ? "contacto" : "contactos"}
                                </span>
                            </div>
                            <div className="table-scroll">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nombre</th>
                                            <th>Teléfono</th>
                                            <th>Red social</th>
                                            <th>Evento</th>
                                            <th>Estado</th>
                                            <th>Fecha registro</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lista.map((c) => {
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
                                                    <td>
                                                        <span className="badge" style={{ background: est.color }}>
                                                            {est.label}
                                                        </span>
                                                    </td>
                                                    <td>{fmtFecha(c.fechaRegistro)}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="edit-link"
                                                            onClick={() => handleEdit(c.id)}
                                                        >
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
                        </div>
                    ))}
                </div>
            )}

            <footer className="note">
                Los datos se guardan en una base de datos Postgres — visibles para todos los que tengan acceso a esta app.
            </footer>
        </div>
    );
}