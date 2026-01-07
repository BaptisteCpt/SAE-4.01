import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const artisan = await prisma.artisan.findUnique({
      where: {
        noartisan: Number(id),
      },
    });

    if (!artisan) {
      return NextResponse.json({ error: "Artisan non trouvé" }, { status: 404 });
    }

    return NextResponse.json(artisan);

  } catch (error) {
    console.error("Erreur récupération artisan:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
