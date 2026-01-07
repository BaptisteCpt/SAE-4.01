import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function PUT(request) {
  try {
    const { id, nom, prenom } = await request.json();

    if (!id || !nom || !prenom) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    const updatedMoe = await prisma.maitre_oeuvre.update({
      where: { nomoe: Number(id) },
      data: {
        nommoe: nom,
        prenommoe: prenom
      }
    });

    return NextResponse.json(updatedMoe);

  } catch (error) {
    console.error("Erreur mise à jour MOE:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la mise à jour." }, { status: 500 });
  }
}
