import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Met à jour les informations d'un modèle de maison existant
 * Remplace également toutes les étapes de construction associées au modèle dans une transaction
 * @param {Request} request - La requête HTTP contenant l'ID et les nouvelles informations du modèle
 * @returns {Promise<NextResponse>} Réponse JSON indiquant le succès de la mise à jour ou un message d'erreur
 */
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, nom, description, etapes } = body;
    // Utilise une transaction Prisma pour garantir la cohérence des données
    // Si une opération échoue, toutes les modifications sont annulées (rollback)
    const maj = await prisma.$transaction(async (ok) => {
        // Étape 1 : Met à jour les informations de base du modèle
        await ok.modele.update({
            where: { nomodele: parseInt(id) },
            data: { 
                nommodele: nom,
                descriptionmodele: description
            }
        });
        // Étape 2 : Supprime toutes les relations construire existantes (pattern replace)
        await ok.construire.deleteMany({
            where: { nomodele: parseInt(id) }
        });
        // Étape 3 : Crée les nouvelles relations construire si des étapes sont fournies
        if (etapes && etapes.length > 0) {
            await ok.construire.createMany({
                // Utilise createMany pour créer plusieurs relations en une seule opération (plus efficace)
                data: etapes.map(idEtape => ({
                    nomodele: parseInt(id),
                    noetape: parseInt(idEtape),
                    // Valeurs par défaut pour les champs financiers et de durée
                    montantfacture: 1,
                    coutsoustraitant: 0,
                    nbjoursrealisation: 1
                }))
            });}
        return true;
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur modification" });
  }
}