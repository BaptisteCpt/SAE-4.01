import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import bcrypt from "bcrypt";

/**
 * Fonction permettant de verifier si l'identifiant et le mot de passe saisie sont bons
 */
export async function POST(request) {
  /*Creation de la fonction POST prenant en parametre une requette*/
  const { login, mot_de_passe, role } =
    await request.json(); /*Recuperation des données du body de la requette HTTP puis decoupage en 2 variables*/
  const user = await prisma.user.findUnique({
    where: { login },
  }); /**Requete qui tente de trouver un login correspondant a la requete dans la table USER */

  const isValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe); // on verifie si le mot de passe hashé est égal au mot de passe donnée

  if (!user || !isValid) {
    /*Verification : si l'utilisateur n'a pas été trouvé ou que le mot de passe de cet utilisateur est different de celui saisie*/
    return NextResponse.json(
      { error: "Identifiants invalides" },
      { status: 401 }
    ); /*Renvoi une reponse JSON Erreur si la condition est verifie*/
  }

  return NextResponse.json({
    success: true,
    user: user,
  }); /* Renvoi d'une reponse JSON de Succes*/
}
