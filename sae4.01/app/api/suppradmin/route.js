import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 

/**
 * Supprime un administrateur de la base de données par son ID
 * @param {Request} request - La requête HTTP contenant l'ID de l'administrateur à supprimer
 * @returns {Promise<NextResponse>} Réponse JSON indiquant le succès ou l'échec de la suppression
 */
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
        return NextResponse.json({ error: "ID requis" });
    }
    await prisma.user.delete({
        where: { id: parseInt(id) }
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur lors de la suppression." });
  }
}