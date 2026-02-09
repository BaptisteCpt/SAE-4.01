import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Récupère la liste de tous les chantiers (sans relations)
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des chantiers ou un message d'erreur
 */
export async function GET() {
  try {
    const data = await prisma.chantier.findMany();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}