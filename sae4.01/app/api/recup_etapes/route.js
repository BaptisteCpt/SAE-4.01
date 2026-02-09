import { NextResponse } from 'next/server';
import prismaBati from '../../lib/prisma'; 

/**
 * Récupère toutes les relations construire (modèle-étape) avec les informations des étapes
 * Formate les données pour inclure le nom de l'étape nettoyé
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des relations construire avec les étapes ou un message d'erreur
 */
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

    // Transforme les données pour ajouter le nom de l'étape nettoyé directement dans l'objet
    // Utilise map pour créer un nouveau tableau avec les données formatées
    const dataFormatee = data.map((item) => ({
      ...item, // Conserve toutes les propriétés de l'item original
      // Ajoute le nom de l'étape nettoyé (sans espaces en début/fin) pour faciliter l'affichage
      nometape: item.etape.nometape.trim() 
    }));

    return NextResponse.json(dataFormatee);
  } catch (err) {
    console.error("Erreur API recup_etapes:", err);
    return NextResponse.json({ error: "Erreur serveur" });
  }
}