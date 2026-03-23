import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

/**
 * Crée une facture artisan pour une étape d'un chantier.
 * Vérifie que l'étape appartient bien à l'artisan connecté.
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const login = (body.login || "").trim();
    const nochantier = Number(body.nochantier);
    const noetape = Number(body.noetape);
    const nbjourstravail = Number(body.nbjourstravail);
    const montantfacture = Number(body.montantfacture);
    const datefacture = body.datefacture;

    if (!login || !nochantier || !noetape || !datefacture) {
      return NextResponse.json(
        { error: "Données obligatoires manquantes." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(nbjourstravail) || nbjourstravail < 0) {
      return NextResponse.json(
        { error: "Nombre de jours invalide." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(montantfacture) || montantfacture < 0) {
      return NextResponse.json(
        { error: "Montant de facture invalide." },
        { status: 400 }
      );
    }

    const affectations = await prisma.$queryRaw`
      SELECT ec.nochantier, ec.noetape
      FROM "Bati_Parti".etape_chantier ec
      INNER JOIN "Bati_Parti".artisan a ON a.noartisan = ec.noartisan
      WHERE ec.nochantier = ${nochantier}
        AND ec.noetape = ${noetape}
        AND LOWER(TRIM(a.login)) = LOWER(${login})
      LIMIT 1
    `;

    if (!Array.isArray(affectations) || affectations.length === 0) {
      return NextResponse.json(
        { error: "Cette étape n'est pas concernée par ce login." },
        { status: 403 }
      );
    }

    const factureExistante = await prisma.facture_artisan.findUnique({
      where: {
        nochantier_noetape: {
          nochantier,
          noetape,
        },
      },
      select: { nofacture: true },
    });

    if (factureExistante) {
      return NextResponse.json(
        { error: "Une facture existe déjà pour cette étape." },
        { status: 409 }
      );
    }

    const nouvelleFacture = await prisma.$transaction(async (tx) => {
      const aggr = await tx.facture_artisan.aggregate({
        _max: { nofacture: true },
      });
      const nextNoFacture = (aggr._max.nofacture || 0) + 1;

      return tx.facture_artisan.create({
        data: {
          nofacture: nextNoFacture,
          datefacture: new Date(datefacture),
          montantfacture,
          nbjourstravail,
          datereglfacture: null,
          nochantier,
          noetape,
        },
      });
    });

    return NextResponse.json(nouvelleFacture);
  } catch (error) {
    console.error("Erreur API POST /creer_facture_artisan:", error);

    // Prisma P2000: valeur trop longue pour une colonne
    if (error?.code === "P2000") {
      return NextResponse.json(
        { error: "Valeur trop longue: vérifie le nombre de caractères des champs saisis." },
        { status: 400 }
      );
    }

    // Prisma P2002: contrainte unique (doublon)
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "Une facture existe déjà pour cette étape." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Une erreur serveur est survenue." },
      { status: 500 }
    );
  }
}
