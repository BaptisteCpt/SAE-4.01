import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Récupère la liste de tous les administrateurs (utilisateurs avec le rôle 'admin')
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des administrateurs ou un message d'erreur
 */
export async function GET() {
    try {
        const administrateurs = await prisma.user.findMany({
            where: {
                role: 'admin'
            }
        });

        return NextResponse.json(administrateurs);
        
    } catch (err) {
        console.error('Erreur recup_admin:', err);
        return NextResponse.json({ error: 'Erreur serveur' });
    }
}