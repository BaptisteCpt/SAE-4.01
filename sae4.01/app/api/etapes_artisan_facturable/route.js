import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

/**
 * Retourne les étapes d'un chantier où l'artisan connecté est affecté,
 * et qui ne possèdent pas encore de facture.
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const login = (searchParams.get("login") || "").trim();
  const nochantier = Number(searchParams.get("chantier"));

  if (!login || !nochantier) {
    return NextResponse.json(
      { error: "Paramètres login et chantier requis." },
      { status: 400 }
    );
  }

  try {
    const etapes = await prisma.$queryRaw`
      SELECT
        ec.noetape,
        e.nometape,
        ec.montanttheoriquefacture,
        ec.datedebut,
        ec.datefin
      FROM "Bati_Parti".etape_chantier ec
      INNER JOIN "Bati_Parti".etape e ON e.noetape = ec.noetape
      INNER JOIN "Bati_Parti".artisan a ON a.noartisan = ec.noartisan
      LEFT JOIN "Bati_Parti".facture_artisan f
        ON f.nochantier = ec.nochantier AND f.noetape = ec.noetape
      WHERE ec.nochantier = ${nochantier}
        AND LOWER(TRIM(a.login)) = LOWER(${login})
        AND f.nofacture IS NULL
      ORDER BY ec.noetape ASC
    `;

    return NextResponse.json(etapes);
  } catch (error) {
    console.error("Erreur API GET /etapes_artisan_facturable:", error);
    return NextResponse.json(
      { error: "Erreur serveur : " + error.message },
      { status: 500 }
    );
  }
}
