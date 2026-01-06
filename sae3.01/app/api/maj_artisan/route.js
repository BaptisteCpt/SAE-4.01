import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, nom, prenom, adresse, cp, ville, etapes } = body;


    const Artisan = await prisma.artisan.update({
      where: { noartisan: parseInt(id) },
      data: {
        nomartisan: nom,
        prenomartisan: prenom,
        adresseartisan: adresse,
        cpartisan: cp,
        villeartisan: ville,
        etre_qualifie_pour: {
          deleteMany: {}, 
          create: etapes.map((idEtape) => ({ 
             etape: { connect: { noetape: parseInt(idEtape) } }
          }))
        }
      },
    });

    return NextResponse.json(Artisan);
  } catch (error) {
    return NextResponse.json({ error: "Erreur modification" });
  }
}