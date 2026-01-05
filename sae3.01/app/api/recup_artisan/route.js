import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const idEtape = parseInt(searchParams.get('etape'));

    if (!idEtape) {
        return NextResponse.json({ error: "Numéro d'étape manquant" }, { status: 400 });
    }

    try {
        const artisanData = await prisma.artisan.findMany({
            where: {
              etre_qualifie_pour: {
                some: {
                  noetape: idEtape
                }
              }
            },
            include: {
              etre_qualifie_pour: true
            }
          });          

        if(!artisanData){
            return NextResponse.json({ error: "artisant introuvable" }, { status: 404 });
        }

        return NextResponse.json(artisanData);
    }catch (error) {
        console.error("Erreur API GET:", error);
        return NextResponse.json({ error: "Erreur serveur : " + error.message }, { status: 500 });
    }
}