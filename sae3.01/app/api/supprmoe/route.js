import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Supprime un maître d'œuvre de la base de données par son ID
 * Supprime également l'utilisateur associé dans une transaction
 * @param {Request} request - La requête HTTP contenant l'ID et le login du maître d'œuvre à supprimer
 * @returns {Promise<NextResponse>} Réponse JSON indiquant le succès de la suppression
 */
export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id, login } = body;

    if (!id) {
        return NextResponse.json({ error: "ID requis" });
    }


    // Utilise une transaction pour supprimer le maître d'œuvre et son utilisateur de manière atomique
    // Si une opération échoue, toutes les modifications sont annulées (rollback)
    await prisma.$transaction([
    // Étape 1 : Supprime l'utilisateur associé au maître d'œuvre
    prisma.user.delete({
        where: { login: login }
    }),
    // Étape 2 : Supprime le maître d'œuvre lui-même
    prisma.maitre_oeuvre.delete({
        where: { nomoe: parseInt(id) }
    })
    ]);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erreur suppression MOE");
  }
}