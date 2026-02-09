import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Supprime un artisan de la base de données par son ID
 * Supprime également toutes les qualifications associées à cet artisan dans une transaction
 * @param {Request} request - La requête HTTP contenant l'ID de l'artisan à supprimer
 * @returns {Promise<NextResponse>} Réponse JSON indiquant le succès de la suppression
 */
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
        return NextResponse.json({ error: "ID requis" });
    }

    // Utilise une transaction pour supprimer l'artisan et ses qualifications de manière atomique
    // Si une opération échoue, toutes les modifications sont annulées (rollback)
    await prisma.$transaction([
        // Étape 1 : Supprime toutes les qualifications de l'artisan
        // Doit être fait avant de supprimer l'artisan pour respecter les contraintes de clé étrangère
        prisma.etre_qualifie_pour.deleteMany({
            where: { noartisan: parseInt(id) }
        }),
        // Étape 2 : Supprime l'artisan lui-même
        prisma.artisan.delete({
            where: { noartisan: parseInt(id) }
        })
    ]);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erreur suppression");
  }
}