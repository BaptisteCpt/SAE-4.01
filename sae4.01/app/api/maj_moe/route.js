import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function PUT(request) {
  try {
    const { id, nom, prenom, mail } = await request.json();

    // On vérifie qu'on a bien reçu les nouvelles données
    if (!id || !nom || !prenom || !mail) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    const moeId = Number(id);

    // Transaction Prisma : si une mise à jour échoue, tout s'annule (c'est très sécurisé)
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Trouver le MOE actuel
      const currentMoe = await tx.maitre_oeuvre.findUnique({
        where: { nomoe: moeId },
      });

      if (!currentMoe || !currentMoe.login) {
        throw new Error("MOE_NOT_FOUND");
      }

      // 2. Trouver le User associé
      const userToUpdate = await tx.user.findUnique({
        where: { login: currentMoe.login }
      });

      if (!userToUpdate) {
        throw new Error("USER_NOT_FOUND");
      }

      // Si tu génères le login dynamiquement basé sur nom/prénom
      const newLogin = `${nom.toLowerCase()}${prenom[0].toLowerCase()}`;

      // 3. Mettre à jour la table maitre_oeuvre
      const updatedMoe = await tx.maitre_oeuvre.update({
        where: { nomoe: moeId },
        data: {
          nommoe: nom,
          prenommoe: prenom,
          login: newLogin, // Mise à jour du login
        },
      });

      // 4. Mettre à jour la table User
      const updatedMoeUser = await tx.user.update({
        where: { login: currentMoe.login }, // On le cherche avec l'ancien login
        data: {
          nom: nom,       // On met aussi à jour son nom/prénom dans la table User !
          prenom: prenom,
          login: newLogin, // On lui donne le nouveau login
          mail: mail,     // Et on met à jour le mail
        },
      });

      return { updatedMoe, updatedMoeUser };
    });

    return NextResponse.json({ message: "Mise à jour réussie", data: result }, { status: 200 });

  } catch (error) {
    console.error("Erreur mise à jour MOE :", error);
    
    // On gère les erreurs si l'email ou le nouveau login est déjà pris par qqn d'autre
    if (error.code === 'P2002') {
        return NextResponse.json({ error: "Cet email ou cet identifiant est déjà utilisé." }, { status: 400 });
    }
    
    if (error.message === "MOE_NOT_FOUND") {
      return NextResponse.json({ error: "Maître d'œuvre introuvable." }, { status: 404 });
    }
    if (error.message === "USER_NOT_FOUND") {
      return NextResponse.json({ error: "Compte utilisateur introuvable." }, { status: 404 });
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}