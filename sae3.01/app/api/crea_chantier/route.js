import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(request) {
  try {
    const corps = await request.json();
    const { date, maitre_doeuvre, modele_maison, adresse_du_chantier, villechantier, code_postal_chantier, noclient } = corps;

 
    if (!maitre_doeuvre || !modele_maison || !adresse_du_chantier || !villechantier || !code_postal_chantier || !noclient) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires." },
      );
    }

    const aggs = await prisma.chantier.aggregate({
      _max: { nochantier: true },
    });
    const nextId = (aggs._max.nochantier || 0) + 1;

    const nouveauChantier = await prisma.chantier.create({
      data: {
        nochantier: nextId,
        adressechantier: adresse_du_chantier,
        cpchantier: code_postal_chantier, 
        villechantier: villechantier,
        datecreation: new Date(date), 
        nomoe: parseInt(maitre_doeuvre),
        nomodele: parseInt(modele_maison),
        noclient: parseInt(noclient), 
      },
    });
    return NextResponse.json(nouveauChantier);

  } catch (error) {
    console.error("Erreur création chantier:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du chantier", details: error.message },
    );
  }
}