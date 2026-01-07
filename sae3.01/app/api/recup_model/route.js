import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
  try {
    const modeles = await prisma.modele.findMany({
      orderBy: { nomodele: 'asc' },
      include: {
        construire: {
          include: {
            etape: true 
          }}}});
    const modele = modeles.map(m => {
        return {
            ...m,
            etapes: m.construire.map(c => c.etape) 
        };
    });
    return NextResponse.json(modele);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" });
  }
}