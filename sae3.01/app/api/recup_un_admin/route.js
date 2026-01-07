import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const admin = await prisma.user.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!admin) {
      return NextResponse.json({ error: "Administrateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json(admin);

  } catch (error) {
    console.error("Erreur récupération Admin:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
