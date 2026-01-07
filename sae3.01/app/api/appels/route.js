import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const idChantier = parseInt(searchParams.get('chantier'));

    if (!idChantier) {
        return NextResponse.json({ error: "Numéro de chantier manquant" }, { status: 400 });
    }

    try {
        const appelData = await prisma.appel.findMany({
            where: {
              nochantier: idChantier,
            }
          });          

        if(!appelData){
            console.log(appelData);
            return NextResponse.json({ error: "appel introuvable" }, { status: 404 });
        }
        
        return NextResponse.json(appelData);
    }catch (error) {
        console.error("Erreur API GET:", error);
        return NextResponse.json({ error: "Erreur serveur : " + error.message }, { status: 500 });
    }
}