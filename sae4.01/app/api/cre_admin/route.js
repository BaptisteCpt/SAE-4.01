import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import bcrypt from "bcrypt";

/**
 * Crée un nouvel administrateur dans la base de données
 * Génère automatiquement un login à partir du nom et prénom (nom + première lettre du prénom en minuscules)
 * @param {Request} request - La requête HTTP contenant le nom et le prénom
 * @returns {Promise<NextResponse>} Réponse JSON avec le nouvel administrateur créé ou un message d'erreur
 */
export async function POST(request) {
  try {
    const corps = await request.json();
    const { nom, prenom } = corps;

    if (!nom || !prenom) {
       return NextResponse.json({ error: "Nom et Prénom sont requis." });
    }

    // Génère un login automatique : nom complet + première lettre du prénom, tout en minuscules
    // Exemple : "Jean" + "Dupont" = "dupontj"
    const pre = prenom.charAt(0).toLowerCase(); // Première lettre du prénom en minuscule
    const nn = nom.toLowerCase(); // Nom complet en minuscules
    let loginAdmin = nn + pre; // Concaténation : nom + première lettre du prénom

    // Vérifie si ce login existe déjà dans la base de données
    const utilisateurExistant = await prisma.user.findUnique({
      where: {
        login: loginAdmin,
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
    const hashedMdp = await bcrypt.hash(loginAdmin, 12);

    const newAdmin = await prisma.user.create({
      data: {
        login: loginAdmin,
        // Stocke le mot de passe hashé au lieu du mot de passe en clair (sécurité)
        mot_de_passe: hashedMdp, 
        role: "admin", // Définit le rôle comme administrateur
        nom: nom.toUpperCase(),
        prenom: prenom,
      },
    });

    return NextResponse.json(newAdmin);

  } catch (error) {
    console.error("Erreur création:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la création." });
  }
}