import { NextResponse } from 'next/server';
import prismaBati from '../../lib/prisma'; 

/**
 * Récupère la liste de tous les utilisateurs (tous rôles confondus)
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste de tous les utilisateurs ou un message d'erreur
 */
export async function GET() {
  try {
    const data = await prismaBati.user.findMany({
    }); 
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: "Erreur serveur" });
  }
}