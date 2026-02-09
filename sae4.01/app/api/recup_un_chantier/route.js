import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 

/**
 * Récupère les informations d'un chantier spécifique par son numéro
 * @param {Request} request - La requête HTTP contenant l'ID du chantier
 * @returns {Promise<NextResponse>} Réponse JSON avec les informations du chantier ou un message d'erreur
 */
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