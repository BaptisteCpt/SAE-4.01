import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

/**
 * Récupère la liste de tous les artisans impliqué dans un chantier
 * Les artisans sont triés par numéro croissant
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des artisans ou un message d'erreur
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const num_chantier = Number(searchParams.get("num_chantier"));

  if (!num_chantier) {
    return NextResponse.json({ error: "Numéro de chantier requis." });
  }
  try {
    const artisans = await prisma.artisan.findMany({
      where: {
        etape_chantier: {
          some: {
            nochantier: num_chantier,
          },
        },
      },
      orderBy: {
        noartisan: "asc",
      },
    });
    return NextResponse.json(artisans);
  } catch (err) {
    return NextResponse.json({ error: `Erreur serveur, ${err}` });
  }
}
