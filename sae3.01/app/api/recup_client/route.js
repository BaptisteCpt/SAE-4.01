import { NextResponse } from 'next/server';
import prismaBati from '../../lib/prisma'; 

export async function GET() {
  try {
    const data = await prismaBati.client.findMany(); 
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" });
  }
}