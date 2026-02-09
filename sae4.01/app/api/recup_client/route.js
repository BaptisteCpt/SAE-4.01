import { NextResponse } from 'next/server';
import prismaBati from '../../lib/prisma'; 

/**
 * Récupère la liste de tous les clients
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des clients ou un message d'erreur
 */
export async function GET() {
  try {
    const data = await prismaBati.client.findMany(); 
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" });
  }
}