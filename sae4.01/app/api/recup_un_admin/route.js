import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Récupère les informations d'un administrateur spécifique par son ID
 * @param {Request} request - La requête HTTP contenant l'ID de l'administrateur
 * @returns {Promise<NextResponse>} Réponse JSON avec les informations de l'administrateur ou un message d'erreur
 */
export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const admin = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Administrateur non trouvé" }, { status: 404 });
    }

    const nom = admin.login;
    const mail = admin.mail;
    return NextResponse.json({ nom, mail });

  } catch (error) {
    console.error("Erreur récupération Admin:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
