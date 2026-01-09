import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Met à jour les informations d'un artisan existant
 * Remplace également toutes les qualifications (étapes) associées à l'artisan
 * @param {Request} request - La requête HTTP contenant l'ID et les nouvelles informations de l'artisan
 * @returns {Promise<NextResponse>} Réponse JSON avec l'artisan mis à jour ou un message d'erreur
 */
export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, nom, prenom, adresse, cp, ville, etapes } = body;


    const Artisan = await prisma.artisan.update({
      where: { noartisan: parseInt(id) },
      data: {
        nomartisan: nom,
        prenomartisan: prenom,
        adresseartisan: adresse,
        cpartisan: cp,
        villeartisan: ville,
        // Remplace toutes les qualifications existantes par les nouvelles
        etre_qualifie_pour: {
          // Supprime toutes les qualifications existantes (pattern replace)
          deleteMany: {}, 
          // Crée les nouvelles qualifications à partir de la liste fournie
          create: etapes.map((idEtape) => ({ 
             etape: { connect: { noetape: parseInt(idEtape) } }
          }))
        }
      },
    });

    return NextResponse.json(Artisan);
  } catch (error) {
    return NextResponse.json({ error: "Erreur modification" });
  }
}