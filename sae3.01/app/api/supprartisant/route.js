import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
        return NextResponse.json({ error: "ID requis" });
    }

    await prisma.$transaction([
        prisma.etre_qualifie_pour.deleteMany({
            where: { noartisan: parseInt(id) }
        }),
        prisma.artisan.delete({
            where: { noartisan: parseInt(id) }
        })
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erreur suppression");
  }
}