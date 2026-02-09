import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Récupère les informations d'un commercial spécifique par son ID
 * @param {Request} request - La requête HTTP contenant l'ID du commercial
 * @returns {Promise<NextResponse>} Réponse JSON avec les informations du commercial ou un message d'erreur
 */
export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const commercial = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!commercial) {
      return NextResponse.json({ error: "Commercial non trouvé" }, { status: 404 });
    }

    // On renvoie les infos (attention sécurité : on renvoie le mot de passe car demandé pour modif)
    return NextResponse.json(commercial);

  } catch (error) {
    console.error("Erreur récupération:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
