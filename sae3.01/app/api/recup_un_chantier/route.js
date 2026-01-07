import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 

export async function POST(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "ID manquant" });
    const chantier = await prisma.chantier.findUnique({
      where: { nochantier: parseInt(id) }
    });
    return NextResponse.json(chantier);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" });
  }
}