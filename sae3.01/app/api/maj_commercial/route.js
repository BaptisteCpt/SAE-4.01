import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import bcrypt from "bcrypt";

/**
 * Met à jour les informations d'un commercial (login et mot de passe)
 * Vérifie que le login n'est pas déjà utilisé par un autre utilisateur
 * @param {Request} request - La requête HTTP contenant l'id, le login et le mot de passe
 * @returns {Promise<NextResponse>} Réponse JSON avec le commercial mis à jour ou un message d'erreur
 */
export async function PUT(request) {
  try {
    const { id, login, mot_de_passe } = await request.json();

    if (!id || !login || !mot_de_passe) {
      return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
    }

    // Vérifie si le login existe déjà pour un AUTRE utilisateur (pas celui qu'on modifie)
    // Utilise findFirst avec une condition "not" pour exclure l'utilisateur actuel
    const existingUser = await prisma.user.findFirst({
      where: {
        login: login,
        // Exclut l'utilisateur qu'on modifie pour permettre de garder le même login
        id: { not: Number(id) }
      }
    });

    // Si un autre utilisateur utilise déjà ce login, on retourne une erreur
    if (existingUser) {
      return NextResponse.json({ error: "Ce login est déjà utilisé." }, { status: 409 });
    }

    const hashedMdp = await bcrypt.hash(mot_de_passe, 12);

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        login: login,
        mot_de_passe: hashedMdp
      }
    });

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("Erreur mise à jour:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la mise à jour." }, { status: 500 });
  }
}
