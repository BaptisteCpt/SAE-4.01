import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Récupère les informations d'un maître d'œuvre spécifique par son numéro
 * @param {Request} request - La requête HTTP contenant l'ID du maître d'œuvre
 * @returns {Promise<NextResponse>} Réponse JSON avec les informations du maître d'œuvre ou un message d'erreur
 */
export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const moe = await prisma.maitre_oeuvre.findUnique({
      where: {
        nomoe: Number(id),
      },
    });

    if (!moe) {
      return NextResponse.json({ error: "Maitre d'oeuvre non trouvé" }, { status: 404 });
    }

    return NextResponse.json(moe);

  } catch (error) {
    console.error("Erreur récupération MOE:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
