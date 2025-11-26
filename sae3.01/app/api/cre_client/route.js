import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(request) {
  try {
    const corps = await request.json();
    const { nom, prenom, adresse, ville, code_postal } = corps;

    if (!nom || !prenom) {
       return NextResponse.json(
        { error: "Nom et Prénom sont requis." }, 
      );
    }
    const present = await prisma.client.findFirst({
      where: {
        nomclient: nom,
        prenomclient: prenom, 
      },
    });

    if (present) {
      return NextResponse.json(present);
    }
    if (!adresse || !ville || !code_postal) {
      return NextResponse.json(
        { error: "Veuillez remplir adresse, ville et CP pour un nouveau client." },
        { status: 400 }
      );
    }

    const aggs = await prisma.client.aggregate({
      _max: {
        noclient: true,
      },
    });
    const nextId = (aggs._max.noclient || 0) + 1;

    const nouveauClient = await prisma.client.create({
      data: {
        noclient: nextId,
        nomclient: nom,
        prenomclient: prenom,
        adresseclient: adresse,
        villeclient: ville,
        cpclient: code_postal, 
      },
    });

    return NextResponse.json(nouveauClient);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du client" },
    );
  }
}