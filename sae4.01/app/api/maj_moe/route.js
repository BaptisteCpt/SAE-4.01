import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

export async function PUT(request) {
  try {
    const { id, nom, prenom, mdp } = await request.json();

    if (!id || !nom || !prenom || !mdp) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    const moeId = Number(id);

    const result = await prisma.$transaction(async (tx) => {
      
      const currentMoe = await tx.maitre_oeuvre.findUnique({
        where: { nomoe: moeId },
      });

      console.log("1. MOE trouvé :", currentMoe);

      if (!currentMoe || !currentMoe.login) {
        throw new Error("MOE_NOT_FOUND");
      }

      const userToUpdate = await tx.user.findUnique({
        where: { login: currentMoe.login }
      });

      console.log("2. User trouvé avec le login", currentMoe.login, ":", userToUpdate);

      if (!userToUpdate) {
        throw new Error("USER_NOT_FOUND");
      }

      const newLogin = `${nom.toLowerCase()}${prenom[0].toLowerCase()}`;

      // 3. Mise à jour du MOE
      const updatedMoe = await tx.maitre_oeuvre.update({
        where: { nomoe: moeId },
        data: {
          nommoe: nom,
          prenommoe: prenom,
          login: newLogin,
        },
      });

      console.log("3. MOE mis à jour avec succès");
      const hashedMdp = await bcrypt.hash(mdp, 12);

      const updatedMoeUser = await tx.user.update({
        where: { login: currentMoe.login },
        data: {
          login: newLogin,
          mot_de_passe: hashedMdp,
        },
      });

      console.log("4. User mis à jour avec succès");

      return { updatedMoe, updatedMoeUser };
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error("Erreur détaillée :", error);
    
    if (error.message === "MOE_NOT_FOUND") {
      return NextResponse.json({ error: "MOE introuvable ou pas de login." }, { status: 404 });
    }
    if (error.message === "USER_NOT_FOUND") {
      return NextResponse.json({ error: "Le User lié à ce MOE n'existe pas en base." }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Erreur serveur", details: error.message },
      { status: 500 }
    );
  }
}