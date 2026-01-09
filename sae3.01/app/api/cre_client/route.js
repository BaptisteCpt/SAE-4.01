import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Crée un nouveau client dans la base de données ou retourne le client existant
 * Vérifie d'abord si un client avec le même nom et prénom existe déjà
 * @param {Request} request - La requête HTTP contenant les informations du client (nom, prénom, adresse, ville, code postal)
 * @returns {Promise<NextResponse>} Réponse JSON avec le client (nouveau ou existant) ou un message d'erreur
 */
export async function POST(request) {
  try {
    const corps = await request.json();
    const { nom, prenom, adresse, ville, code_postal } = corps;

    // Vérifie que les champs obligatoires (nom et prénom) sont remplis
    if (!nom || !prenom) {
       return NextResponse.json(
        { error: "Nom et Prénom sont requis." }, 
      );
    }
    // Recherche si un client avec le même nom et prénom existe déjà
    // Utilise findFirst pour trouver le premier client correspondant
    const present = await prisma.client.findFirst({
      where: {
        nomclient: nom,
        prenomclient: prenom, 
      },
    });

    // Si le client existe déjà, on le retourne sans en créer un nouveau
    // Cela évite les doublons et permet de réutiliser les clients existants
    if (present) {
      return NextResponse.json(present);
    }
    // Si le client n'existe pas, on vérifie que tous les champs sont remplis pour le créer
    // Pour un nouveau client, l'adresse, la ville et le code postal sont obligatoires
    if (!adresse || !ville || !code_postal) {
      return NextResponse.json(
        { error: "Veuillez remplir adresse, ville et CP pour un nouveau client." },
        { status: 400 }
      );
    }

    // Récupère le numéro de client maximum pour générer le prochain ID unique
    const aggs = await prisma.client.aggregate({
      _max: {
        noclient: true,
      },
    });
    // Calcule le prochain ID en ajoutant 1 au maximum, ou 1 si aucun client n'existe
    const nextId = (aggs._max.noclient || 0) + 1;
    
    // Création du nouveau client dans la base
    const nouveauClient = await prisma.client.create({
      data: {
        noclient: nextId,
        nomclient: nom,
        prenomclient: prenom,
        adresseclient: adresse,
        villeclient: ville,
        cpclient: code_postal, 
      },
    });

    return NextResponse.json(nouveauClient);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la création du client" },
    );
  }
}