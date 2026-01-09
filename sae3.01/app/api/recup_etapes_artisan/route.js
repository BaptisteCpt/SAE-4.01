import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Récupère la liste de toutes les étapes disponibles, triées par numéro croissant
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des étapes ou un message d'erreur
 */
export async function GET() {
    try {
        const etapes = await prisma.etape.findMany({
            orderBy: {
                noetape: 'asc', 
            },
        });
        
        return NextResponse.json(etapes);
    } catch (err) {
        return NextResponse.json({ error: "Erreur" });
    }
}