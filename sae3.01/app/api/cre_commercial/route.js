import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import bcrypt from "bcrypt";

/**
 * Crée un nouvel utilisateur commercial dans la base de données
 * Génère automatiquement un login à partir du nom et prénom (nom + première lettre du prénom en minuscules)
 * @param {Request} request - La requête HTTP contenant le nom et le prénom
 * @returns {Promise<NextResponse>} Réponse JSON avec le nouveau commercial créé ou un message d'erreur
 */
export async function POST(request) {
  try {
    const corps = await request.json();
    const { nom, prenom } = corps;

    if (!nom || !prenom) {
       return NextResponse.json({ error: "Nom et Prénom sont requis." });
    }

    // Génère un login automatique : première lettre du prénom + nom complet, tout en minuscules
    // Exemple : "Marie" + "Martin" = "martinm"
    const pre = prenom.charAt(0).toLowerCase(); // Première lettre du prénom en minuscule
    const nn = nom.toLowerCase(); // Nom complet en minuscules
    let loginCom = nn + pre; // Concaténation : nom + première lettre du prénom

    // Vérifie si ce login existe déjà dans la base de données
    const utilisateurExistant = await prisma.user.findUnique({
      where: {
        login: loginCom,
      },
    });

    // Si le login existe déjà, on retourne une erreur pour éviter les doublons
    if (utilisateurExistant) {
        return NextResponse.json(
            { error: "Ce login existe déjà." },
        );
    }

    // Hash le mot de passe avec bcrypt avant de le stocker dans la base de données
    // Le mot de passe par défaut est le même que le login (à changer lors de la première connexion)
    // Utilise un salt rounds de 12 pour un bon équilibre entre sécurité et performance
    const hashedMdp = await bcrypt.hash(loginCom, 12);

    const nouveauCommerciale = await prisma.user.create({
      data: {
        login: loginCom,
        // Stocke le mot de passe hashé au lieu du mot de passe en clair (sécurité)
        mot_de_passe: hashedMdp, 
        role: "commercial", // Définit le rôle comme commercial
      },
    });

    return NextResponse.json(nouveauCommerciale);

  } catch (error) {
    console.error("Erreur création:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la création." });
  }
}