import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 
import bcrypt from "bcrypt";


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
        login: nom.toLowerCase() + prenom.charAt(0).toLowerCase(), // Génère un login simple (ex: "DupontJ")
        // Utilise le spread operator pour ajouter les qualifications seulement si elles existent
        // Cela évite d'envoyer undefined à Prisma
        ...(listeQualif && { etre_qualifie_pour: listeQualif }),
      },
    });

    const loginArtisan = nom.toLowerCase() + prenom.charAt(0).toLowerCase(); // Doit correspondre au login de l'artisan
    const hashedMdp = await bcrypt.hash(loginArtisan, 12);
    
    const NouvelArtisantUser = await prisma.user.create({
      data: {
        login: loginArtisan, // Doit correspondre au login de l'artisan
        mot_de_passe: hashedMdp,
        role: "artisan",
        nom: nom,
        prenom: prenom,
      },
    });

    return NextResponse.json([NouvelArtisan, NouvelArtisantUser]);
  } catch (error){
    console.error("Erreur création artisan:", error);
    return NextResponse.json("Erreur serveur lors de la création.");
  }
}