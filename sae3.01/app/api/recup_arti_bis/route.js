import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

/**
 * Récupère la liste de tous les artisans avec leurs qualifications (étapes)
 * Les artisans sont triés par numéro croissant
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des artisans avec leurs qualifications ou un message d'erreur
 */
export async function GET() {
  try {
    const artisans = await prisma.artisan.findMany({
      orderBy: { noartisan: 'asc' },
      include: {
        etre_qualifie_pour: true 
      }
    });
    return NextResponse.json(artisans);
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" });
  }
}