import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(request) {
  try {
    const corps = await request.json();
    const { nom, prenom } = corps;

    if (!nom || !prenom) {
       return NextResponse.json({ error: "Nom et Prénom sont requis." });
    }

    const pre = prenom.charAt(0).toLowerCase();
    const nn = nom.toLowerCase();
    let loginCom = nn + pre;

    const utilisateurExistant = await prisma.user.findUnique({
      where: {
        login: loginCom,
      },
    });

    if (utilisateurExistant) {
        return NextResponse.json(
            { error: "Ce login existe déjà." },
        );
    }

    const nouveauCommerciale = await prisma.user.create({
      data: {
        login: loginCom,
        mot_de_passe: loginCom, 
        role: "commercial",
      },
    });

    return NextResponse.json(nouveauCommerciale);

  } catch (error) {
    console.error("Erreur création:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la création." });
  }
}