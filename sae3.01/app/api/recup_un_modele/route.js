import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(request) {
  try {
    const { id } = await request.json();
    const modele = await prisma.modele.findUnique({
      where: { nomodele: parseInt(id) },
      include: {
        construire: {
          include: { etape: true }
        }
      }
    });
    if (!modele) return NextResponse.json({ error: "Introuvable" });
    const modeleun = {
        ...modele,
        etapesIDs: modele.construire.map(c => c.noetape)
    };
    return NextResponse.json(modeleun);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" });
  }
}