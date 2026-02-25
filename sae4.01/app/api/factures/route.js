import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

/**
 * Récupère la liste de tous les artisans impliqué dans un chantier
 * Les artisans sont triés par numéro croissant
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des artisans ou un message d'erreur
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const num_artisan = Number(searchParams.get("num_artisan"));

  if (!num_chantier) {
    return NextResponse.json({ error: "Numéro d'artisan requis." });
  }
  try {
    const factures = await prisma.facture_artisan.findMany({
      include: {
        etape_chantier: true,
      },
      where: {
        etape_chantier: {
          some: {
            noartisan: num_artisan,
          },
        },
      },
    });
    return NextResponse.json(factures);
  } catch (err) {
    return NextResponse.json({ error: `Erreur serveur, ${err}` });
  }
}
