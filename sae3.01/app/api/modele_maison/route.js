import { NextResponse } from 'next/server';
import prismaBati from '../../lib/prisma'; 

/**
 * Récupère la liste de tous les modèles de maison
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des modèles ou un message d'erreur
 */
export async function GET() {
  try {
    const data = await prismaBati.modele.findMany(); 
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" });
  }
}