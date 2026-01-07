import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, adresse, cp, ville, client, modele, moe } = body;
    const maj = await prisma.chantier.update({
        where: { nochantier: parseInt(id) },
        data: {
            adressechantier: adresse,
            cpchantier: cp,
            villechantier: ville,
            noclient: parseInt(client),
            nomodele: parseInt(modele),
            nomoe: parseInt(moe)
        }
    });
    return NextResponse.json({ success: true, data: maj });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur modification" });
  }
}