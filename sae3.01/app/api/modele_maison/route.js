import { NextResponse } from 'next/server';
import prismaBati from '../../lib/prisma'; // Ajustez le nombre de ../ selon la profondeur

export async function GET() {
  try {
    const data = await prismaBati.modele.findMany(); 
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}