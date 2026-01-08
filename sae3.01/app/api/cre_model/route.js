import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { nom, description, etapes } = body; 
    
    if (!nom) return NextResponse.json({ error: "Nom obligatoire" })
   
    const aggr = await prisma.modele.aggregate({ _max: { nomodele: true } });
    const nId = (aggr._max.nomodele || 0) + 1;

    const nouveauModele = await prisma.modele.create({
        data: {
            nomodele: nId,       // L'ID (nombre - 1 'm')
            nommodele: nom,      // Le Nom (texte - 2 'm')
            descriptionmodele: description || "",
            construire: {
                create: etapes.map(item => ({
                    noetape: parseInt(item.id),
                    montantfacture: 1,
                    coutsoustraitant: 0,
                    // Ici on récupère bien les jours dynamiques envoyés par le front
                    nbjoursrealisation: parseInt(item.jours)
                }))
            }
        }
    });
    return NextResponse.json(nouveauModele);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur création" });
  }
}