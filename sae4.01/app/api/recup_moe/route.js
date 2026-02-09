import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Récupère la liste de tous les maîtres d'œuvre
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des maîtres d'œuvre ou un message d'erreur
 */
export async function GET() {
    try {
        const moe = await prisma.maitre_oeuvre.findMany({});

        return NextResponse.json(moe);
        
    } catch (err) {
        console.error('Erreur recup_moe:', err);
        return NextResponse.json({ error: 'Erreur serveur' });
    }
}