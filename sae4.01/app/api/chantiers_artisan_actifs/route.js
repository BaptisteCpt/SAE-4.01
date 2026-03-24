import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

/**
 * Récupère les chantiers où l'artisan connecté est affecté dans les étapes.
 * Le filtre se fait via le login utilisateur, relié à artisan.login.
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const login = (searchParams.get("login") || "").trim();

  if (!login) {
    return NextResponse.json(
      { error: "Login requis." },
      { status: 400 }
    );
  }

  try {
    const rows = await prisma.$queryRaw`
      SELECT
        c.nochantier,
        c.adressechantier,
        c.cpchantier,
        c.villechantier,
        c.datecreation,
        ec.noetape,
        e.nometape,
        ec.reservee,
        ec.datedebut,
        ec.datefin,
        f.nofacture
      FROM "Bati_Parti".etape_chantier ec
      INNER JOIN "Bati_Parti".artisan a ON a.noartisan = ec.noartisan
      INNER JOIN "Bati_Parti".chantier c ON c.nochantier = ec.nochantier
      INNER JOIN "Bati_Parti".etape e ON e.noetape = ec.noetape
      LEFT JOIN "Bati_Parti".facture_artisan f
        ON f.nochantier = ec.nochantier AND f.noetape = ec.noetape
      WHERE LOWER(TRIM(a.login)) = LOWER(${login})
      ORDER BY c.nochantier ASC, ec.noetape ASC
    `;

    const grouped = new Map();
    for (const row of rows) {
      if (!grouped.has(row.nochantier)) {
        grouped.set(row.nochantier, {
          nochantier: row.nochantier,
          adressechantier: row.adressechantier,
          cpchantier: row.cpchantier,
          villechantier: row.villechantier,
          datecreation: row.datecreation,
          etapes: [],
        });
      }

      const nofacture =
        row.nofacture != null ? Number(row.nofacture) : null;
      grouped.get(row.nochantier).etapes.push({
        noetape: row.noetape,
        nometape: row.nometape,
        reservee: row.reservee,
        datedebut: row.datedebut,
        datefin: row.datefin,
        nofacture,
      });
    }

    const chantiers = Array.from(grouped.values());
    return NextResponse.json(chantiers);
  } catch (error) {
    console.error("Erreur API GET /chantiers_artisan_actifs:", error);
    return NextResponse.json(
      { error: "Erreur serveur : " + error.message },
      { status: 500 }
    );
  }
}
