import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
    try {
        const moe = await prisma.maitre_oeuvre.findMany({});

        return NextResponse.json(moe);
        
    } catch (err) {
        console.error('Erreur recup_moe:', err);
        return NextResponse.json({ error: 'Erreur serveur' });
    }
}