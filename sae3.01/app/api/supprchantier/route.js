import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Supprime un chantier de la base de données par son numéro
 * @param {Request} request - La requête HTTP contenant l'ID du chantier à supprimer
 * @returns {Promise<NextResponse>} Réponse JSON indiquant le succès de la suppression ou un message d'erreur
 */
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) return NextResponse.json({ error: "ID requis" });

    await prisma.chantier.delete({
        where: { nochantier: parseInt(id) }
    });
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erreur suppression chantier:", error);
    return NextResponse.json({ error: "Erreur serveur" });
  }
}
