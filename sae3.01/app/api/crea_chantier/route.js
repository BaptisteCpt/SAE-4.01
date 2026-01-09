import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Crée un nouveau chantier dans la base de données
 * Génère automatiquement un numéro de chantier unique
 * @param {Request} request - La requête HTTP contenant les informations du chantier (date, maître d'œuvre, modèle, adresse, ville, CP, client)
 * @returns {Promise<NextResponse>} Réponse JSON avec le nouveau chantier créé ou un message d'erreur
 */
export async function POST(request) {
  try {
    const corps = await request.json();
    const { date, maitre_doeuvre, modele_maison, adresse_du_chantier, villechantier, code_postal_chantier, noclient } = corps;

    // Vérification que les champs sont bien rempli
    if (!maitre_doeuvre || !modele_maison || !adresse_du_chantier || !villechantier || !code_postal_chantier || !noclient) {
      return NextResponse.json(
        { error: "Veuillez remplir tous les champs obligatoires." },
      );
    }

    // Récupère le numéro de chantier maximum pour générer le prochain ID unique
    const aggs = await prisma.chantier.aggregate({
      _max: { nochantier: true },
    });
    // Calcule le prochain ID en ajoutant 1 au maximum, ou 1 si aucun chantier n'existe
    const nextId = (aggs._max.nochantier || 0) + 1;

    // Crée le nouveau chantier avec toutes les informations fournies
    const nouveauChantier = await prisma.chantier.create({
      data: {
        nochantier: nextId,
        adressechantier: adresse_du_chantier,
        cpchantier: code_postal_chantier, 
        villechantier: villechantier,
        // Convertit la date string en objet Date pour le stockage
        datecreation: new Date(date), 
        // Convertit les IDs en nombres pour les relations avec les autres tables
        nomoe: parseInt(maitre_doeuvre),
        nomodele: parseInt(modele_maison),
        noclient: parseInt(noclient), 
      },
    });
    return NextResponse.json(nouveauChantier);

  } catch (error) {
    console.error("Erreur création chantier:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du chantier", details: error.message },
    );
  }
}