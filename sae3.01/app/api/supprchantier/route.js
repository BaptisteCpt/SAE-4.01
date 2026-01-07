import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "ID requis" });

    await prisma.chantier.delete({
        where: { nochantier: parseInt(id) }
    });
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erreur suppression chantier:", error);
    return NextResponse.json({ error: "Erreur serveur" });
  }
}
