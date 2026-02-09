import { NextResponse } from 'next/server';
import prismaBati from '../../lib/prisma'; 

/**
 * Récupère la liste de tous les maîtres d'œuvre
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des maîtres d'œuvre ou un message d'erreur
 */
export async function GET() {
  try {
    const data = await prismaBati.maitre_oeuvre.findMany(); 
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" });
  }
}