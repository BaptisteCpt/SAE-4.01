import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET); // pour generer les tokens JWT

/**
 * Gère les requêtes POST pour l'authentification des utilisateurs.
 * Vérifie les identifiants (login et mot de passe) en utilisant bcrypt pour comparer le mot de passe hashé.
 * Retourne les informations de l'utilisateur si l'authentification réussit.
 * 
 * @param {object} request - L'objet de la requête Next.js contenant les identifiants de connexion.
 * @param {string} request.body.login - L'identifiant (login) de l'utilisateur.
 * @param {string} request.body.mot_de_passe - Le mot de passe en clair de l'utilisateur (sera comparé avec le hash stocké).
 * @param {string} [request.body.role] - Le rôle de l'utilisateur (optionnel, non utilisé actuellement).
 * @returns {NextResponse} Une réponse JSON contenant :
 *   - En cas de succès : { success: true, user: { id, login, role, ... } }
 *   - En cas d'échec : { error: 'Identifiants invalides' } avec un statut HTTP 401
 */
export async function POST(request) {
  // Récupère les données d'authentification depuis le corps de la requête
  const { login, mot_de_passe, role } = await request.json();
  
  // Recherche l'utilisateur dans la base de données par son login
  // Utilise findUnique pour une recherche optimisée par index (login est unique)
  const user = await prisma.user.findUnique({
    where: { login },
  });

  // Vérifie d'abord si l'utilisateur existe dans la base de données
  // Si l'utilisateur n'existe pas, on retourne une erreur sans vérifier le mot de passe
  // Cela évite de révéler si un login existe ou non (sécurité)
  if (!user) {
    return NextResponse.json(
      { error: "Identifiants invalides" },
      { status: 401 }
    );
  }

  // Compare le mot de passe fourni (en clair) avec le hash stocké dans la base de données
  // bcrypt.compare() effectue une comparaison sécurisée qui résiste aux attaques par timing
  // Retourne true si le mot de passe correspond, false sinon
  const isValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

  // Si le mot de passe ne correspond pas, on retourne une erreur d'authentification
  // On utilise le même message d'erreur que pour un utilisateur inexistant (sécurité)
  if (!isValid) {
    return NextResponse.json(
      { error: "Identifiants invalides" },
      { status: 401 }
    );
  }

  // Générer le JWT et le placer dans un cookie HTTP-only
  const token = await new SignJWT({ role: user.role, login: user.login, nom: user.nom, prenom: user.prenom })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("8h")
    .sign(SECRET);


  // Si l'authentification réussit, retourne les informations de l'utilisateur
  // Le client pourra utiliser ces informations pour déterminer les permissions et afficher l'interface appropriée
  const response = NextResponse.json({
    success: true,
    role: user.role,
  });

  response.cookies.set("session", token, { // création du cookie avec un age max de 8h
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return response;
}
