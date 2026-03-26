import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. Récupérer tous les artisans
    const artisans = await prisma.artisan.findMany({
      orderBy: { noartisan: 'asc' },
      include: { etre_qualifie_pour: true }
    });

    // 2. Récupérer tous les utilisateurs "artisan" pour avoir leurs mails
    const users = await prisma.user.findMany({
        where: { role: 'artisan' },
        select: { login: true, mail: true }
    });

    // 3. Combiner les deux (associer le mail au bon artisan)
    const artisansAvecMail = artisans.map(artisan => {
        const userAssocie = users.find(u => u.login === artisan.login);
        return {
            ...artisan,
            mail: userAssocie ? userAssocie.mail : ""
        };
    });

    return NextResponse.json(artisansAvecMail);
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}