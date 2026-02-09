import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

/**
 * Récupère la liste des artisans qualifiés pour une étape spécifique
 * @param {Request} request - La requête HTTP contenant le numéro d'étape en paramètre de requête
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des artisans qualifiés pour l'étape ou un message d'erreur
 */
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const idEtape = parseInt(searchParams.get('etape'));

    if (!idEtape) {
        return NextResponse.json({ error: "Numéro d'étape manquant" }, { status: 400 });
    }

    try {
        // Recherche tous les artisans qui sont qualifiés pour l'étape spécifiée
        // Utilise la relation etre_qualifie_pour avec un filtre "some" pour trouver les artisans
        const artisanData = await prisma.artisan.findMany({
            where: {
              // Filtre : trouve les artisans qui ont AU MOINS UNE qualification pour cette étape
              etre_qualifie_pour: {
                some: {
                  noetape: idEtape
                }
              }
            },
            // Inclut toutes les qualifications de chaque artisan (pas seulement celle recherchée)
            include: {
              etre_qualifie_pour: true
            }
          });          

        if(!artisanData){
            return NextResponse.json({ error: "artisant introuvable" }, { status: 404 });
        }

        return NextResponse.json(artisanData);
    }catch (error) {
        console.error("Erreur API GET:", error);
        return NextResponse.json({ error: "Erreur serveur : " + error.message }, { status: 500 });
    }
}