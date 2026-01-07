import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

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