import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Récupère la liste de tous les modèles de maison avec leurs étapes associées
 * Formate les données pour inclure les étapes dans un format plus lisible
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des modèles avec leurs étapes ou un message d'erreur
 */
export async function GET() {
  try {
    // Récupère tous les modèles avec leurs relations construire et étapes
    const modeles = await prisma.modele.findMany({
      orderBy: { nomodele: 'asc' }, // Trie par numéro de modèle croissant
      include: {
        construire: {
          include: {
            etape: true // Inclut les informations complètes de chaque étape
          }}}});
    // Transforme les données pour un format plus lisible côté client
    // Extrait les étapes de la structure construire pour les mettre directement dans un tableau
    const modele = modeles.map(m => {
        return {
            ...m, // Conserve toutes les propriétés du modèle
            // Extrait les étapes de la relation construire dans un tableau simple
            etapes: m.construire.map(c => c.etape) 
        };
    });
    return NextResponse.json(modele);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" });
  }
}