import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 

/**
 * Sauvegarde ou met à jour la date de règlement d'un appel d'offres
 * Vérifie que l'appel existe dans le chantier avant de le mettre à jour
 * @param {Request} request - La requête HTTP contenant l'ID du chantier, le numéro d'appel et la date
 * @returns {Promise<NextResponse>} Réponse JSON indiquant le succès de la sauvegarde ou un message d'erreur
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { chantierId, noappel, date } = body; // on récupère les données passées en paramètres

        if (!chantierId || !noappel) { // on vérifie qu'on a bien nos données critiques
            return NextResponse.json({ error: "Données manquantes" }, { status: 400 });
        }

        const idChantier = parseInt(chantierId);
        const idAppel = parseInt(noappel);

        // Vérifie que l'appel existe bien dans le chantier avant de mettre à jour la date de règlement
        const existing = await prisma.appel.findFirst({
            where: { nochantier: idChantier, noappel: idAppel }
        });

        if (existing) {
            // Si l'appel existe, on met à jour sa date de règlement
            // Utilise updateMany pour mettre à jour toutes les lignes correspondantes
            await prisma.appel.updateMany({
                where: { nochantier: idChantier, noappel: idAppel },
                data: {
                    // Enregistre la date de règlement (marque l'appel comme payé)
                    datereglappel: date,
                }
            });
        } else {
            // L'appel doit exister dans le chantier avant de pouvoir être marqué comme payé
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