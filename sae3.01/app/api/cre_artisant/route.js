import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 

export async function POST(request) {
  try {
    const info = await request.json();
    const { nom, prenom, adresse, cp, ville, etapes } = info;
    const aggs = await prisma.artisan.aggregate({
      _max: { noartisan: true },
    });
    const nextId = (aggs._max.noartisan || 0) + 1;
    let listeQualif = undefined; 
    if (etapes && Array.isArray(etapes) && etapes.length > 0) {
        listeQualif = {
            create: etapes.map((idEtape) => ({
                etape: {
                    connect: { noetape: parseInt(idEtape) }
                }
            }))
        };
    }

    const NouvelArtisan = await prisma.artisan.create({
      data: {
        noartisan: nextId,
        nomartisan: nom,
        prenomartisan: prenom,
        adresseartisan: adresse,
        cpartisan: cp,
        villeartisan: ville,
        ...(listeQualif && { etre_qualifie_pour: listeQualif }),
      },
    });

    return NextResponse.json(NouvelArtisan);
  } catch (error){
    console.error("Erreur création artisan:", error);
    return NextResponse.json("Erreur serveur lors de la création.");
  }
}