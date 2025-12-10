import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 

export async function POST(request) {
    try {
        const body = await request.json();
        const { chantierId, etapeId, reserve, supplements } = body;

        if (!chantierId || !etapeId) {
            return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
        }

        // 1. Check Sécurité
        const etapeInfo = await prisma.etape.findUnique({
            where: { noetape: parseInt(etapeId) }
        });

        if (!etapeInfo) {
            return NextResponse.json({ error: "Étape inconnue" }, { status: 404 });
        }

        if (reserve === true && !etapeInfo.reservable) {
            return NextResponse.json(
                { error: "Action illégale : Cette étape n'est pas réservable." }, 
                { status: 403 }
            );
        }

        // 2. Calcul des montants et description
        let totalMontant = 0;
        let description = "";

        if (supplements && supplements.length > 0) {
            // Calcul du prix total (reste inchangé)
            totalMontant = supplements.reduce((acc, item) => {
                return item.type === 'plus' ? acc + item.price : acc - item.price;
            }, 0);
            
            // --- CORRECTION ICI ---
            // On map seulement 's.label' sans ajouter les '+' ou '-'
            description = supplements.map(s => s.label).join(', ');
        }

        // 3. Enregistrement
        const cId = parseInt(chantierId);
        const eId = parseInt(etapeId);

        const existing = await prisma.etape_chantier.findFirst({
            where: { nochantier: cId, noetape: eId }
        });

        if (existing) {
            await prisma.etape_chantier.updateMany({
                where: { nochantier: cId, noetape: eId },
                data: {
                    reservee: reserve,
                    reducsuppl: totalMontant,
                    descriptionreducsuppl: description // Sauvegardera ex: "Peinture, Prise"
                }
            });
        } else {
            await prisma.etape_chantier.create({
                data: {
                    nochantier: cId,
                    noetape: eId,
                    reservee: reserve,
                    reducsuppl: totalMontant,
                    descriptionreducsuppl: description,
                    montanttheoriquefacture: 0
                }
            });
        }

        return NextResponse.json({ success: true, message: "Sauvegardé avec succès" });

    } catch (error) {
        console.error("Erreur API POST:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}