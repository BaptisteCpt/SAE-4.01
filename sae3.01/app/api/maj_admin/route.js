import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Met à jour les informations d'un administrateur (login et mot de passe)
 * @param {Request} request - La requête HTTP contenant l'id, le login et le mot de passe
 * @returns {Promise<NextResponse>} Réponse JSON avec l'administrateur mis à jour ou un message d'erreur
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

    const updatedAdmin = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        login: login,
        mot_de_passe: mot_de_passe
      }
    });

    return NextResponse.json(updatedAdmin);

  } catch (error) {
    console.error("Erreur mise à jour Admin:", error);
    return NextResponse.json({ error: "Erreur serveur lors de la mise à jour." }, { status: 500 });
  }
}
