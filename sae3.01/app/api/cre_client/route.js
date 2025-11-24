import { NextResponse } from 'next/server';
import prismaBati from '../lib/prismaBati'; // Vérifiez toujours ce chemin

export async function POST(request) {
  try {
    const body = await request.json();
    const { nom, prenom, adresse, ville, code_postal } = body;

    // 1. Validation basique
    if (!nom || !adresse || !ville || !code_postal) {
      return NextResponse.json(
        { error: "Tous les champs obligatoires (Nom, Adresse, Ville, CP) doivent être remplis." },
        { status: 400 }
      );
    }

    // 2. Gestion de l'ID (Car pas d'autoincrement dans votre schéma)
    // On cherche le client avec l'ID le plus grand actuel
    const aggs = await prismaBati.client.aggregate({
      _max: {
        noclient: true,
      },
    });
    
    // Le nouvel ID sera l'ancien max + 1, ou 1 si la table est vide
    const nextId = (aggs._max.noclient || 0) + 1;

    // 3. Création du client
    const newClient = await prismaBati.client.create({
      data: {
        noclient: nextId, // On assigne l'ID calculé
        nomclient: nom,
        prenomclient: prenom,
        adresseclient: adresse,
        villeclient: ville,
        cpclient: code_postal,
      },
    });

    // 4. On renvoie le client créé (Surtout son ID !)
    return NextResponse.json(newClient, { status: 201 });

  } catch (error) {
    console.error("Erreur création client:", error);
    
    // Gestion spécifique des erreurs Prisma (ex: champs trop longs)
    return NextResponse.json(
      { error: "Erreur lors de la création du client", details: error.message },
      { status: 500 }
    );
  }
}