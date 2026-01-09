import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Récupère la liste de tous les chantiers avec leurs relations (client, modèle, maître d'œuvre)
 * Les chantiers sont triés par numéro décroissant (plus récents en premier)
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des chantiers ou un message d'erreur
 */
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