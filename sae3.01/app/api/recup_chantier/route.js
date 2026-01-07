import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
  try {
    const chantiers = await prisma.chantier.findMany({
      orderBy: {
        nochantier: 'desc'
      },
      include: {
        client: true,
        modele: true,
        maitre_oeuvre: true
      }
    });
    return NextResponse.json(chantiers);
  } catch (error) {
    console.error("Erreur récupération chantiers:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}