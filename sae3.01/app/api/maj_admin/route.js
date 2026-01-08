import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function PUT(request) {
  try {
    const { id, login, mot_de_passe } = await request.json();

    if (!id || !login || !mot_de_passe) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    // Vérifier si le login existe déjà pour un AUTRE utilisateur
    const existingUser = await prisma.user.findFirst({
      where: {
        login: login,
        id: { not: Number(id) } 
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Ce login est déjà utilisé." }, { status: 409 });
    }

    const updatedAdmin = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        login: login,
        mot_de_passe: mot_de_passe
      }
    });

    return NextResponse.json(updatedAdmin);

  } catch (error) {
    console.error("Erreur mise à jour Admin:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la mise à jour." }, { status: 500 });
  }
}
