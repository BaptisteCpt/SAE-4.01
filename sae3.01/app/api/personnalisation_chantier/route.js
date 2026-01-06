import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 

export async function POST(request) {
    try {
        const body = await request.json();
        const { chantierId, etapeId, reservee, supplements } = body; // on récupère les données passées en paramètres

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


        // On vérifie que l'étape soit réservable
        
        if (reservee === true && !etapeInfo.reservable) {
            return NextResponse.json(
                { error: "Cette étape n'est pas réservable." }, 
                { status: 403 }
            );
        }

        let totalMontant = 0;
        let description = "";
        
        // On vérifie si on a au moins un supplément/réduction
        if (supplements && supplements.length > 0) {
            // Calcul du prix total pour avoir qu'une valeur si on a plusieurs suppléments/réductions
            totalMontant = supplements.reduce((acc, item) => {
                return item.type === 'plus' ? acc + item.price : acc - item.price;
            }, 0);
            
            // On construit la description en fusionnant les descriptions récupérées au cas où on a plusieurs suppléments/réductions
            description = supplements.map(s => s.label).join(', ');
        }

        const idChantier = parseInt(chantierId);
        const idEtape = parseInt(etapeId);
        console.log(reservee);

        // On vérifie qu'il existe l'étape donnée dans le chantier donné
        const existing = await prisma.etape_chantier.findFirst({
            where: { nochantier: idChantier, noetape: idEtape }
        });

        if (existing) { // Si elle existe on la modifie avec nos données
            await prisma.etape_chantier.updateMany({
                where: { nochantier: idChantier, noetape: idEtape },
                data: {
                    reservee: reservee,
                    reducsuppl: totalMontant,
                    descriptionreducsuppl: description
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