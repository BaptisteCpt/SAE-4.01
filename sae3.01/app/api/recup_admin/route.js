import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

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