import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';

/**
 * Parse une date et la convertit en format ISO
 * @param {string|Date} date - La date à parser
 * @returns {string|null} La date au format ISO ou null si la date est invalide
 */
function parseDateISO(date) {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

/**
 * Met à jour la date de début théorique d'une étape d'un chantier
 * @param {Request} req - La requête HTTP contenant l'ID du chantier, l'ID de l'étape et la date théorique
 * @returns {Promise<NextResponse>} Réponse JSON indiquant le succès de la mise à jour ou un message d'erreur
 */
export async function POST(req) {
  try {
    const { chantierId, etapeId, dateTheo } = await req.json();

    if (!chantierId || !etapeId || !dateTheo) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    // Met à jour la date théorique en utilisant la clé composite (chantier + étape)
    // La clé composite permet d'identifier de manière unique une étape dans un chantier
    const updated = await prisma.etape_chantier.update({
      where: { 
        // Utilise la clé composite pour identifier l'enregistrement
        // Convertit les IDs en nombres pour s'assurer du bon type
        nochantier_noetape: { nochantier: parseInt(chantierId), noetape: parseInt(etapeId) } 
      },
      data: { 
        // Parse la date pour s'assurer qu'elle est au bon format ISO
        datedebuttheorique: parseDateISO(dateTheo) 
      },
    });

    return NextResponse.json({ message: 'Date théorique mise à jour', updated }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
