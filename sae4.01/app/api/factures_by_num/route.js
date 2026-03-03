import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function GET(request) {
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
        },
      },
    },
  });

  if (!facture) {
    return NextResponse.json({ error: "Introuvable" }, { status: 404 });
  }

  return NextResponse.json(facture);
}