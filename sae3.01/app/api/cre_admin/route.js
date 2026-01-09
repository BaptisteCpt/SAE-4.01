import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const corps = await request.json();
    const { nom, prenom } = corps;

    if (!nom || !prenom) {
       return NextResponse.json({ error: "Nom et Prénom sont requis." });
    }

    const pre = prenom.charAt(0).toLowerCase();
    const nn = nom.toLowerCase();
    let loginAdmin = nn + pre;

    const utilisateurExistant = await prisma.user.findUnique({
      where: {
        login: loginAdmin,
      },
    });

    if (utilisateurExistant) {
        return NextResponse.json(
            { error: "Ce login existe déjà." },
        );
    }

    const hashedMdp = await bcrypt.hash(loginAdmin, 12);

    const newAdmin = await prisma.user.create({
      data: {
        login: loginAdmin,
        mot_de_passe: hashedMdp, 
        role: "admin",
      },
    });

    return NextResponse.json(newAdmin);

  } catch (error) {
    console.error("Erreur création:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la création." });
  }
}