import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Crée un nouveau modèle de maison dans la base de données
 * Génère automatiquement un numéro de modèle unique et associe les étapes de construction
 * @param {Request} request - La requête HTTP contenant le nom, la description et la liste des étapes
 * @returns {Promise<NextResponse>} Réponse JSON avec le nouveau modèle créé ou un message d'erreur
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { nom, description, etapes } = body; 
    
    if (!nom) return NextResponse.json({ error: "Nom obligatoire" })
   
    // Récupère le numéro de modèle maximum pour générer le prochain ID unique
    const aggr = await prisma.modele.aggregate({ _max: { nomodele: true } });
    // Calcule le prochain ID en ajoutant 1 au maximum, ou 1 si aucun modèle n'existe
    const nId = (aggr._max.nomodele || 0) + 1;

    const nouveauModele = await prisma.modele.create({
        data: {
            nomodele: nId,
            nommodele: nom,
            descriptionmodele: description || "", // Utilise une chaîne vide si description est absente
            // Crée les relations construire (modèle-étape) pour chaque étape fournie
            // Les étapes sont envoyées depuis le front avec un format { id, jours }
            construire: {
                create: etapes.map(item => ({
                    noetape: parseInt(item.id), // ID de l'étape
                    // Valeurs par défaut pour les champs financiers
                    montantfacture: 1,
                    coutsoustraitant: 0,
                    // Récupère le nombre de jours de réalisation envoyé dynamiquement par le front
                    // Si non fourni, utilise 1 par défaut
                    nbjoursrealisation: parseInt(item.jours) || 1
                }))
            }
        }
    });
    return NextResponse.json(nouveauModele);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur création" });
  }
}