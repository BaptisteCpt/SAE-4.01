import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Supprime un modèle de maison de la base de données par son ID
 * Supprime également toutes les relations de construction associées
 * @param {Request} request - La requête HTTP contenant l'ID du modèle à supprimer
 * @returns {Promise<NextResponse>} Réponse JSON indiquant le succès de la suppression ou un message d'erreur
 */
export async function DELETE(request) {
  try {
    const { id } = await request.json();
    await prisma.construire.deleteMany({
        where: { nomodele: parseInt(id) }
    });
    await prisma.modele.delete({
        where: { nomodele: parseInt(id) }
    });
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" });
  }
}