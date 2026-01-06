import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

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