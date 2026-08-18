import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ContactoInput } from "@/lib/constants";

// PUT /api/contactos/:id → actualiza un contacto existente
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = (await request.json()) as Partial<ContactoInput>;

    const contacto = await prisma.contacto.update({
      where: { id },
      data: {
        nombre: body.nombre?.trim().toUpperCase(),
        telefono: body.telefono?.trim(),
        redSocial: body.redSocial,
        usuarioRed: body.usuarioRed?.trim(),
        tipoEvento: body.tipoEvento,
        categoriaMarca: body.categoriaMarca,
        estado: body.estado as any,
        fechaRegistro: body.fechaRegistro ? new Date(body.fechaRegistro) : undefined,
      },
    });

    return NextResponse.json({ contacto });
  } catch (error) {
    console.error("Error al actualizar contacto:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el contacto." },
      { status: 500 }
    );
  }
}

// DELETE /api/contactos/:id → elimina un contacto
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.contacto.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al eliminar contacto:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar el contacto." },
      { status: 500 }
    );
  }
}
