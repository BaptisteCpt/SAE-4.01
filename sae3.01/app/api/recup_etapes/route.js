import { NextResponse } from 'next/server';
import prismaBati from '../../lib/prisma'; 

export async function GET() {
  try {
    // 1. On demande à Prisma de récupérer la table 'construire'
    // ET d'inclure les infos de la table 'etape' liée
    const data = await prismaBati.construire.findMany({
      include: {
        etape: true // C'est ici que la magie opère grâce à ton schema
      },
      orderBy: {
        noetape: 'asc' // On trie par défaut par numéro d'étape
      }
    });

    // 2. On transforme un peu les données pour simplifier la vie du Frontend
    const dataFormatee = data.map((item) => ({
      ...item, // On garde montant, durée, etc.
      
      // On remonte le nom directement à la racine et on enlève les espaces vides (.trim())
      nometape: item.etape.nometape.trim() 
    }));

    return NextResponse.json(dataFormatee);
  } catch (err) {
    console.error("Erreur API recup_etapes:", err);
    return NextResponse.json({ error: "Erreur serveur" });
  }
}