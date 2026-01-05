import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 

export async function POST(request) {
    try {
        const body = await request.json();
        const { chantierId, etapeId, noartisan } = body; // on récupère les données passées en paramètres

        if (!chantierId || !etapeId) { // on vérifie qu'on a bien nos données critiques
            return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
        }

        // On vérifie que l'étape existe dans la base
        const etapeInfo = await prisma.etape.findUnique({
            where: { noetape: parseInt(etapeId) }
        });

        if (!etapeInfo) {
            return NextResponse.json({ error: "Étape inconnue" }, { status: 404 });
        }

        const idChantier = parseInt(chantierId);
        const idEtape = parseInt(etapeId);

        // On vérifie qu'il existe l'étape donnée dans le chantier donné
        const existing = await prisma.etape_chantier.findFirst({
            where: { nochantier: idChantier, noetape: idEtape }
        });

        if (existing) { // Si elle existe on la modifie avec nos données
            await prisma.etape_chantier.updateMany({
                where: { nochantier: idChantier, noetape: idEtape },
                data: {
                    noartisan: parseInt(noartisan)
                }
            });
        } else {
            return NextResponse.json(
                { error: "étape non existante dans ce chantier" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true, message: "Sauvegardé avec succès" });

    } catch (error) {
        console.error("Erreur API POST:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}