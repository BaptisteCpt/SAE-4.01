import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, nom, description, etapes } = body;
    const maj = await prisma.$transaction(async (ok) => {
        await ok.modele.update({
            where: { nomodele: parseInt(id) },
            data: { 
                nommodele: nom,
                descriptionmodele: description
            }
        });
        await ok.construire.deleteMany({
            where: { nomodele: parseInt(id) }
        });
        if (etapes && etapes.length > 0) {
            await ok.construire.createMany({
                data: etapes.map(idEtape => ({
                    nomodele: parseInt(id),
                    noetape: parseInt(idEtape),
                    montantfacture: 1,
                    coutsoustraitant: 0,
                    nbjoursrealisation: 1
                }))
            });}
        return true;
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur modification" });
  }
}