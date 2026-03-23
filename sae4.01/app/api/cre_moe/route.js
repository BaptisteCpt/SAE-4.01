import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import bcrypt from "bcrypt";

/**
 * Crée un nouveau maître d'œuvre dans la base de données
 * Génère automatiquement un numéro de maître d'œuvre unique
 * @param {Request} request - La requête HTTP contenant le nom et le prénom du maître d'œuvre
 * @returns {Promise<NextResponse>} Réponse JSON avec le nouveau maître d'œuvre créé ou un message d'erreur
 */
export async function POST(request) {
  try {
    const corps = await request.json();
    const { nom, prenom } = corps;

    if (!nom || !prenom) {
       return NextResponse.json({ error: "Nom et Prénom sont requis." }, { status: 400 });
    }

    // Génère un login automatique : nom complet + première lettre du prénom, tout en minuscules
    // Exemple : "Pierre" + "Martin" = "martinp"
    const pre = prenom.charAt(0).toLowerCase(); // Première lettre du prénom en minuscule
    const nn = nom.toLowerCase(); // Nom complet en minuscules
    let loginMoe = nn + pre; // Concaténation : nom + première lettre du prénom

    // Récupère le numéro de maître d'œuvre maximum pour générer le prochain ID unique
    const aggs = await prisma.maitre_oeuvre.aggregate({
      _max: { nomoe: true },
    });
    // Calcule le prochain ID en ajoutant 1 au maximum, ou 1 si aucun maître d'œuvre n'existe
    const nextId = (aggs._max.nomoe || 0) + 1;
    
    // Crée d'abord l'entrée maître d'œuvre dans la table dédiée
    const nouvMoe = await prisma.maitre_oeuvre.create({
      data: {
        nomoe: nextId,
        nommoe: nom,
        prenommoe: prenom,
        login: loginMoe, // Stocke le login pour référence
        
      },
    });

    // Hash le mot de passe avec bcrypt avant de le stocker dans la base de données
    // Le mot de passe par défaut est le même que le login (à changer lors de la première connexion)
    // Utilise un salt rounds de 12 pour un bon équilibre entre sécurité et performance
    const hashedMdp = await bcrypt.hash(loginMoe, 12);

    // Crée ensuite l'utilisateur associé dans la table user pour permettre la connexion
    // Le maître d'œuvre a besoin d'un compte utilisateur pour se connecter à l'application
    const nouveauMaitreUser = await prisma.user.create({
      data: {
        login: loginMoe,
        // Stocke le mot de passe hashé au lieu du mot de passe en clair (sécurité)
        mot_de_passe: hashedMdp, 
        role: "maitre Oeuvre", // Définit le rôle comme maître d'œuvre
        nom: nom,
        prenom: prenom,
      },
    });

    return NextResponse.json(nouvMoe);
  } catch (error) {
    console.error("Erreur création MOE:", error);
    return NextResponse.json("Erreur serveur lors de la création.");
  }
}