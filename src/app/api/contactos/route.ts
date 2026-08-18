import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContactoInput } from "@/lib/constants";

const CAMPOS_REQUERIDOS: (keyof ContactoInput)[] = [
  "nombre",
  "telefono",
  "redSocial",
  "usuarioRed",
  "tipoEvento",
  "categoriaMarca",
  "estado",
  "fechaRegistro",
];

function validar(body: Partial<ContactoInput>) {
  for (const campo of CAMPOS_REQUERIDOS) {
    if (!body[campo] || String(body[campo]).trim() === "") {
      return `El campo "${campo}" es obligatorio.`;
    }
  }
  return null;
}

// GET /api/contactos → lista todos los contactos, más recientes primero
export async function GET() {
  try {
    const contactos = await prisma.contacto.findMany({
      orderBy: { creadoEn: "desc" },
    });
    return NextResponse.json({ contactos });
  } catch (error) {
    console.error("Error al listar contactos:", error);
    return NextResponse.json(
      { error: "No se pudieron cargar los registros." },
      { status: 500 }
    );
  }
}

// POST /api/contactos → crea un contacto nuevo
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ContactoInput>;

    const errorValidacion = validar(body);
    if (errorValidacion) {
      return NextResponse.json({ error: errorValidacion }, { status: 400 });
    }

    const contacto = await prisma.contacto.create({
      data: {
        nombre: body.nombre!.trim().toUpperCase(), // mayúsculas también en el servidor
        telefono: body.telefono!.trim(),
        redSocial: body.redSocial!,
        usuarioRed: body.usuarioRed!.trim(),
        tipoEvento: body.tipoEvento!,
        categoriaMarca: body.categoriaMarca!,
        estado: body.estado as any,
        fechaRegistro: new Date(body.fechaRegistro!),
      },
    });

    return NextResponse.json({ contacto }, { status: 201 });
  } catch (error) {
    console.error("Error al crear contacto:", error);
    return NextResponse.json(
      { error: "No se pudo guardar el contacto." },
      { status: 500 }
    );
  }
}
