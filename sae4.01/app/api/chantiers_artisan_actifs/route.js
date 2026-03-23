import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

/**
 * Récupère les chantiers où l'artisan connecté est affecté dans les étapes.
 * @param {Request} request
 * @returns {Promise<NextResponse>}
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const loginRaw = searchParams.get("login");
  const login = loginRaw ? loginRaw.trim() : "";
  const loginAsNumber = Number(login);

  if (!login) {
    return NextResponse.json(
      { error: "Login artisan manquant." },
      { status: 400 }
    );
  }

  try {
    const etapesArtisan = await prisma.etape_chantier.findMany({
      where: {
        OR: [
          {
            artisan: {
              noartisan: Number.isNaN(loginAsNumber) ? -1 : loginAsNumber,
            },
          },
          {
            artisan: {
              nomartisan: {
                equals: login,
                mode: "insensitive",
              },
            },
          },
        ],
      },
      orderBy: [{ nochantier: "asc" }, { noetape: "asc" }],
      select: {
        nochantier: true,
        noetape: true,
        datedebuttheorique: true,
        datedebut: true,
        datefin: true,
        chantier: {
          select: {
            adressechantier: true,
            cpchantier: true,
            villechantier: true,
            datecreation: true,
          },
        },
        etape: {
          select: {
            nometape: true,
          },
        },
      },
    });

    const grouped = new Map();

    for (const item of etapesArtisan) {
      if (!grouped.has(item.nochantier)) {
        grouped.set(item.nochantier, {
          nochantier: item.nochantier,
          adresse: item.chantier?.adressechantier?.trim() || "",
          cp: item.chantier?.cpchantier?.trim() || "",
          ville: item.chantier?.villechantier?.trim() || "",
          datecreation: item.chantier?.datecreation || null,
          etapes: [],
        });
      }

      grouped.get(item.nochantier).etapes.push({
        noetape: item.noetape,
        nometape: item.etape?.nometape?.trim() || "",
        datedebuttheorique: item.datedebuttheorique,
        datedebut: item.datedebut,
        datefin: item.datefin,
      });
    }

    return NextResponse.json(Array.from(grouped.values()));
  } catch (error) {
    console.error("Erreur API GET /chantiers_artisan_actifs:", error);
    return NextResponse.json(
      { error: "Erreur serveur : " + error.message },
      { status: 500 }
    );
  }
}
