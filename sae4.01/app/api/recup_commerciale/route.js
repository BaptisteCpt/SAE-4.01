import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Récupère la liste de tous les commerciaux (utilisateurs avec le rôle 'commercial')
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des commerciaux ou un message d'erreur
 */
export async function GET() {
    try {
        const commerciaux = await prisma.user.findMany({
            where: {
                role: 'commercial'
            }
        });

        return NextResponse.json(commerciaux);
        
    } catch (err) {
        console.error('Erreur recup_commerciale:', err);
        return NextResponse.json({ error: 'Erreur serveur' });
    }
}