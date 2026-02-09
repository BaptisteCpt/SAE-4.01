import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Met à jour les informations d'un chantier existant
 * @param {Request} request - La requête HTTP contenant l'ID et les nouvelles informations du chantier
 * @returns {Promise<NextResponse>} Réponse JSON indiquant le succès de la mise à jour ou un message d'erreur
 */
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, adresse, cp, ville, client, modele, moe } = body;
    // Met à jour toutes les informations du chantier
    const maj = await prisma.chantier.update({
        where: { nochantier: parseInt(id) },
        data: {
            adressechantier: adresse,
            cpchantier: cp,
            villechantier: ville,
            // Convertit les IDs en nombres pour les relations avec les autres tables
            noclient: parseInt(client),
            nomodele: parseInt(modele),
            nomoe: parseInt(moe)
        }
    });
    return NextResponse.json({ success: true, data: maj });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur modification" });
  }
}