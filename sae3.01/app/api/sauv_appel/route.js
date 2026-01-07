import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 

export async function POST(request) {
    try {
        const body = await request.json();
        const { chantierId, noappel, date } = body; // on récupère les données passées en paramètres

        if (!chantierId || !noappel) { // on vérifie qu'on a bien nos données critiques
            return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
        }

        const idChantier = parseInt(chantierId);
        const idAppel = parseInt(noappel);

        // On vérifie qu'il existe l'appel donnée dans le chantier donné
        const existing = await prisma.appel.findFirst({
            where: { nochantier: idChantier, noappel: idAppel }
        });

        if (existing) { // Si elle existe on la modifie avec nos données
            await prisma.appel.updateMany({
                where: { nochantier: idChantier, noappel: idAppel },
                data: {
                    datereglappel: date,
                }
            });
        } else {
            return NextResponse.json(
                { error: "appel non existant dans ce chantier" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: "Sauvegardé avec succès" });

    } catch (error) {
        console.error("Erreur API POST:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}