import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { getApiSession } from "../../lib/auth";

export async function GET(request) {
  const session = await getApiSession();
  if (!session?.role || !session.login) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const nofacture = Number(searchParams.get("nofacture"));

  if (!nofacture) {
    return NextResponse.json({ error: "Numéro facture requis" }, { status: 400 });
  }

  const facture = await prisma.facture_artisan.findUnique({
    where: { nofacture },
    include: {
      etape_chantier: {
        include: {
          etape: true,
          chantier: true,
        },
      },
    },
  });

  if (!facture) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  if (session.role === "artisan") {
    const loginArtisan = String(session.login || "").trim();
    const autorise = await prisma.$queryRaw`
      SELECT 1 AS ok
      FROM "Bati_Parti".facture_artisan f
      INNER JOIN "Bati_Parti".etape_chantier ec
        ON ec.nochantier = f.nochantier AND ec.noetape = f.noetape
      INNER JOIN "Bati_Parti".artisan a ON a.noartisan = ec.noartisan
      WHERE f.nofacture = ${nofacture}
        AND LOWER(TRIM(a.login)) = LOWER(${loginArtisan})
      LIMIT 1
    `;
    if (!Array.isArray(autorise) || autorise.length === 0) {
      return NextResponse.json({ error: "Interdit" }, { status: 403 });
    }
  } else if (session.role !== "maitre Oeuvre") {
    return NextResponse.json({ error: "Interdit" }, { status: 403 });
  }

  return NextResponse.json(facture);
}