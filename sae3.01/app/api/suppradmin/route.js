import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
        return NextResponse.json({ error: "ID requis" });
    }
    await prisma.user.delete({
        where: { id: parseInt(id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur lors de la suppression." });
  }
}