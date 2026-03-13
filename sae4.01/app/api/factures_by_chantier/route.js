import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

/**
 * Récupère la liste de tous les artisans impliqué dans un chantier
 * Les artisans sont triés par numéro croissant
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des artisans ou un message d'erreur
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const num_etape = Number(searchParams.get("num_etape"));
  const num_chantier = Number(searchParams.get("num_chantier"));

  if (!num_chantier || !num_etape) {
    return NextResponse.json({ error: "Numéro de chantier et d'étape requis." });
  }
  try {
    const factures = await prisma.facture_artisan.findMany({
      include: {
        etape_chantier: {include: {
          etape: true,
        }},
      },
      where: {
        nochantier: num_chantier,
        etape_chantier: {
          noartisan: num_artisan,
        },
      },
    });
    
    return NextResponse.json(factures);
  } catch (err) {
    return NextResponse.json({ error: `Erreur serveur, ${err}` });
  }
}
