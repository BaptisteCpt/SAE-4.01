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
            nomodele: nId,
            nommodele: nom,
            descriptionmodele: description || "",
            construire: {
                create: etapes.map(idEtape => ({
                    noetape: parseInt(idEtape),
                    montantfacture: 1,
                    coutsoustraitant: 0,
                    nbjoursrealisation: 1
                }))}}});
    return NextResponse.json(nouveauModele);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur création" });
  }
}