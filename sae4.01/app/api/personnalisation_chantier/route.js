import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 

/**
 * Sauvegarde les personnalisations d'une étape d'un chantier (réservation, suppléments/réductions)
 * Vérifie que l'étape est réservable avant de permettre la réservation
 * Calcule le montant total des suppléments/réductions et construit une description
 * @param {Request} request - La requête HTTP contenant l'ID du chantier, l'ID de l'étape, le statut de réservation et les suppléments
 * @returns {Promise<NextResponse>} Réponse JSON indiquant le succès de la sauvegarde ou un message d'erreur
 */
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
        
        // Traite les suppléments/réductions si au moins un est fourni
        if (supplements && supplements.length > 0) {
            // Calcule le montant total net en additionnant les suppléments et soustrayant les réductions
            // Utilise reduce pour parcourir tous les suppléments et accumuler le total
            totalMontant = supplements.reduce((acc, item) => {
                // Si c'est un supplément (type 'plus'), on additionne, sinon on soustrait
                return item.type === 'plus' ? acc + item.price : acc - item.price;
            }, 0); // Valeur initiale à 0
            
            // Construit une description unique en fusionnant toutes les descriptions
            // Utilise map pour extraire les labels, puis join pour les séparer par des virgules
            description = supplements.map(s => s.label).join(', ');
        }

        const idChantier = parseInt(chantierId);
        const idEtape = parseInt(etapeId);
        console.log(reservee);

        // On vérifie qu'il existe l'étape donnée dans le chantier donné
        const existing = await prisma.etape_chantier.findFirst({
            where: { nochantier: idChantier, noetape: idEtape }
        });

        if (existing) {
            // Si l'étape est déjà personnalisée, on met à jour ses informations
            // Utilise updateMany pour mettre à jour toutes les lignes correspondantes
            await prisma.etape_chantier.updateMany({
                where: { nochantier: idChantier, noetape: idEtape },
                data: {
                    reservee: reservee, // Statut de réservation
                    reducsuppl: totalMontant, // Montant total net (peut être négatif pour une réduction)
                    descriptionreducsuppl: description // Description combinée de tous les suppléments/réductions
                }
            });
        } else {
            // L'étape doit d'abord être créée dans le chantier avant d'être personnalisée
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