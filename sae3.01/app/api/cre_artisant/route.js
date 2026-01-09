import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 

/**
 * Crée un nouvel artisan dans la base de données
 * Génère automatiquement un numéro d'artisan unique et peut associer des qualifications (étapes)
 * @param {Request} request - La requête HTTP contenant les informations de l'artisan (nom, prénom, adresse, CP, ville, étapes)
 * @returns {Promise<NextResponse>} Réponse JSON avec le nouvel artisan créé ou un message d'erreur
 */
export async function POST(request) {
  try {
    const info = await request.json();
    const { nom, prenom, adresse, cp, ville, etapes } = info;
    // Récupère le numéro d'artisan maximum pour générer le prochain ID unique
    const aggs = await prisma.artisan.aggregate({
      _max: { noartisan: true },
    });
    // Calcule le prochain ID en ajoutant 1 au maximum, ou 1 si aucun artisan n'existe
    const nextId = (aggs._max.noartisan || 0) + 1;
    let listeQualif = undefined; 
    // Si des étapes sont fournies, on crée les relations de qualification
    if (etapes && Array.isArray(etapes) && etapes.length > 0) {
        // Utilise la syntaxe Prisma nested create pour créer les relations
        // map transforme chaque ID d'étape en une relation à connecter
        listeQualif = {
            create: etapes.map((idEtape) => ({
                etape: {
                    // Connecte l'artisan à l'étape via la relation etre_qualifie_pour
                    connect: { noetape: parseInt(idEtape) }
                }
            }))
        };
    }

    const NouvelArtisan = await prisma.artisan.create({
      data: {
        noartisan: nextId,
        nomartisan: nom,
        prenomartisan: prenom,
        adresseartisan: adresse,
        cpartisan: cp,
        villeartisan: ville,
        // Utilise le spread operator pour ajouter les qualifications seulement si elles existent
        // Cela évite d'envoyer undefined à Prisma
        ...(listeQualif && { etre_qualifie_pour: listeQualif }),
      },
    });

    return NextResponse.json(NouvelArtisan);
  } catch (error){
    console.error("Erreur création artisan:", error);
    return NextResponse.json("Erreur serveur lors de la création.");
  }
}