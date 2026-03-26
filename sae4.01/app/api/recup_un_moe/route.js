import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    // 1. On récupère le MOE
    const moe = await prisma.maitre_oeuvre.findUnique({
      where: { nomoe: Number(id) },
    });

    if (!moe) return NextResponse.json({ error: "Maitre d'oeuvre non trouvé" }, { status: 404 });

    // 2. On récupère son Email dans la table User via son login
    let mailUser = "";
    if (moe.login) {
        const user = await prisma.user.findUnique({
            where: { login: moe.login },
            select: { mail: true } // On ne prend que le mail
        });
        if (user && user.mail) mailUser = user.mail;
    }

    // 3. On renvoie un objet combiné au composant React
    return NextResponse.json({
        ...moe,
        mail: mailUser
    });

  } catch (error) {
    console.error("Erreur récupération MOE:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}