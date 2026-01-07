import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await prisma.construire.deleteMany({
        where: { nomodele: parseInt(id) }
    });
    await prisma.modele.delete({
        where: { nomodele: parseInt(id) }
    });
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" });
  }
}