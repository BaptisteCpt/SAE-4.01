import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function GET() {
  try {
    const artisans = await prisma.artisan.findMany({
      orderBy: { noartisan: 'asc' },
      include: {
        etre_qualifie_pour: true 
      }
    });
    return NextResponse.json(artisans);
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" });
  }
}