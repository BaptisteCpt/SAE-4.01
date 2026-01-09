import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 

/**
 * Assigne un artisan à une étape d'un chantier
 * Vérifie que l'étape existe et qu'elle est associée au chantier avant de mettre à jour
 * @param {Request} request - La requête HTTP contenant l'ID du chantier, l'ID de l'étape et le numéro d'artisan
 * @returns {Promise<NextResponse>} Réponse JSON indiquant le succès de la sauvegarde ou un message d'erreur
 */
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

        // Vérifie que l'étape est bien associée au chantier avant de pouvoir assigner un artisan
        const existing = await prisma.etape_chantier.findFirst({
            where: { nochantier: idChantier, noetape: idEtape }
        });

        if (existing) {
            // Si l'étape existe dans le chantier, on met à jour l'artisan assigné
            // Utilise updateMany pour mettre à jour toutes les lignes correspondantes
            await prisma.etape_chantier.updateMany({
                where: { nochantier: idChantier, noetape: idEtape },
                data: {
                    // Convertit l'ID de l'artisan en nombre (peut être null si aucun artisan n'est assigné)
                    noartisan: parseInt(noartisan)
                }
            });
        } else {
            // L'étape doit d'abord être créée dans le chantier avant de pouvoir assigner un artisan
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