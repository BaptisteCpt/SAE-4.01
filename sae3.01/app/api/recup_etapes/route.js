import { NextResponse } from 'next/server';
import prismaBati from '../../lib/prisma'; 

export async function GET() {
  try {
    const data = await prismaBati.construire.findMany({
      include: {
        etape: true 
      },
      orderBy: {
        noetape: 'asc' 
      }
    });

    const dataFormatee = data.map((item) => ({
      ...item, 
      nometape: item.etape.nometape.trim() 
    }));

    return NextResponse.json(dataFormatee);
  } catch (err) {
    console.error("Erreur API recup_etapes:", err);
    return NextResponse.json({ error: "Erreur serveur" });
  }
}