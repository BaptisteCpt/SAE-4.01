import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 

export async function POST(request) {
  try {
    const corps = await request.json();
    const { nom, prenom } = corps;

    if (!nom || !prenom) {
       return NextResponse.json({ error: "Nom et Prénom sont requis." }, { status: 400 });
    }

    const aggs = await prisma.maitre_oeuvre.aggregate({
      _max: { nomoe: true },
    });
    const nextId = (aggs._max.nomoe || 0) + 1;
    const nouvMoe = await prisma.maitre_oeuvre.create({
      data: {
        nomoe: nextId,
        nommoe: nom,
        prenommoe: prenom,
      },
    });
    return NextResponse.json(nouvMoe);
  } catch (error) {
    console.error("Erreur création MOE:", error);
    return NextResponse.json("Erreur serveur lors de la création.");
  }
}