import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Met à jour les informations d'un maître d'œuvre existant (nom et prénom)
 * @param {Request} request - La requête HTTP contenant l'ID et les nouvelles informations du maître d'œuvre
 * @returns {Promise<NextResponse>} Réponse JSON avec le maître d'œuvre mis à jour ou un message d'erreur
 */
export async function PUT(request) {
  try {
    const { id, nom, prenom } = await request.json();

    if (!id || !nom || !prenom) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    const updatedMoe = await prisma.maitre_oeuvre.update({
      where: { nomoe: Number(id) },
      data: {
        nommoe: nom,
        prenommoe: prenom
      }
    });

    return NextResponse.json(updatedMoe);

  } catch (error) {
    console.error("Erreur mise à jour MOE:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la mise à jour." }, { status: 500 });
  }
}
