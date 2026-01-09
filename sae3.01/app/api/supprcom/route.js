import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; // Fixed import

/**
 * Supprime un commercial de la base de données par son ID
 * Vérifie d'abord que l'utilisateur existe avant de le supprimer
 * @param {Request} request - La requête HTTP contenant l'ID du commercial à supprimer
 * @returns {Promise<NextResponse>} Réponse JSON indiquant le succès ou l'échec de la suppression
 */
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
        return NextResponse.json({ error: "ID requis" }, { status: 400 });
    }
    
    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
        where: { id: parseInt(id) }
    });

    if (!existingUser) {
        return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    await prisma.user.delete({
        where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erreur suppression commercial:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la suppression" }, { status: 500 });
  }
}
