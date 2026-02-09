import prisma from "../../lib/prisma";
import { NextResponse } from "next/server";

function parseDateISO(date) {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

export async function POST(req) {
  try {
    const { chantierId, date } = await req.json();

    if (!chantierId) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    const dateF = parseDateISO(date);

    const inserted = await prisma.appel.create({
      data: {
        nochantier: parseInt(chantierId),
        noappel: 1,
        dateappel: dateF,
        montantappel: 1,
      },
    });

    return NextResponse.json(
      { message: "appel inséré", inserted },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}
