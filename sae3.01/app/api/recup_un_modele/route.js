import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Récupère les informations d'un modèle de maison spécifique par son ID
 * Inclut les étapes de construction associées et retourne également les IDs des étapes
 * @param {Request} request - La requête HTTP contenant l'ID du modèle
 * @returns {Promise<NextResponse>} Réponse JSON avec les informations du modèle et ses étapes ou un message d'erreur
 */
export async function POST(request) {
  try {
    const { id } = await request.json();
    const modele = await prisma.modele.findUnique({
      where: { nomodele: parseInt(id) },
      include: {
        construire: {
          include: { etape: true }
        }
      }
    });
    if (!modele) return NextResponse.json({ error: "Introuvable" });
    // Transforme les données pour extraire les IDs des étapes dans un tableau simple
    // Facilite l'utilisation côté client en évitant de parcourir la structure construire
    const modeleun = {
        ...modele, // Conserve toutes les propriétés du modèle
        // Extrait uniquement les numéros d'étape de la relation construire
        etapesIDs: modele.construire.map(c => c.noetape)
    };
    return NextResponse.json(modeleun);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" });
  }
}