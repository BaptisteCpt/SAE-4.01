import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";

/**
 * Récupère les étapes d'un chantier spécifique avec leurs personnalisations
 * Inclut les informations sur les artisans assignés, les dates, les suppléments/réductions
 * @param {Request} request - La requête HTTP contenant le numéro de chantier en paramètre de requête
 * @returns {Promise<NextResponse>} Réponse JSON contenant la liste des étapes du chantier avec leurs personnalisations ou un message d'erreur
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const idChantier = parseInt(searchParams.get("chantier"));

  if (!idChantier) {
    return NextResponse.json(
      { error: "Numéro de chantier manquant" },
      { status: 400 }
    );
  }

  try {
    const chantierData = await prisma.chantier.findUnique({
      where: { nochantier: idChantier },
      include: {
        modele: {
          include: {
            construire: {
              include: { etape: true },
            },
          },
        },
        etape_chantier: true,
      },
    });

    if (!chantierData) {
      return NextResponse.json(
        { error: "Chantier introuvable" },
        { status: 404 }
      );
    }

    if (!chantierData.modele) {
      return NextResponse.json(
        { error: "Aucun modèle associé à ce chantier" },
        { status: 404 }
      );
    }

    // Utilise Promise.all pour traiter toutes les étapes en parallèle (optimisation)
    // Pour chaque étape du modèle, on construit un objet avec ses personnalisations
    const listeFinale = await Promise.all(
      chantierData.modele.construire.map(async (lien) => {
        // Récupère l'étape associée via la relation construire
        const toutesEtapes = lien.etape;
        // Recherche si cette étape a été personnalisée pour ce chantier
        const perso = chantierData.etape_chantier.find(
          (p) => p.noetape === toutesEtapes.noetape
        );

        // Initialise les variables avec des valeurs par défaut
        const supplements = [];
        let isReserved = false;
        let dateTheo = null;
        let dateDebut = null;
        let dateFin = null;
        let nomA = null;
        let prenomA = null;
        let montantMax = null;

        // Si l'étape a été personnalisée, on récupère toutes ses informations
        if (perso) {
          isReserved = perso.reservee;
          // Convertit le montant de réduction/supplément en nombre décimal
          const montant = parseFloat(perso.reducsuppl);
          dateTheo = perso.datedebuttheorique;
          dateDebut = perso.datedebut;
          dateFin = perso.datefin;
          // Le montant maximum autorisé est 30% du montant théorique de facturation
          montantMax = 0.30 * perso.montanttheoriquefacture;

          // Si un artisan a été assigné à cette étape, on récupère ses informations
          if (perso?.noartisan != null) {
            const artisan = await prisma.artisan.findUnique({
              where: { noartisan: perso.noartisan },
            });

            if (artisan) {
              nomA = artisan.nomartisan;
              prenomA = artisan.prenomartisan;
            }
          }

          // Si un montant de réduction/supplément existe, on l'ajoute à la liste
          if (montant !== 0) {
            supplements.push({
              id: 999, // ID temporaire pour l'affichage
              label: perso.descriptionreducsuppl || "Ajustement existant",
              price: Math.abs(montant), // Valeur absolue pour l'affichage
              // Détermine le type selon le signe : positif = supplément, négatif = réduction
              type: montant > 0 ? "plus" : "moins",
            });
          }
        }

        // Retourne un objet formaté avec toutes les informations de l'étape
        return {
          idchantier: idChantier,
          id: toutesEtapes.noetape,
          nom: toutesEtapes.nometape.trim(), // Supprime les espaces en début/fin
          description: chantierData.modele.descriptionmodele || "Étape standard",
          reservee: isReserved,
          isReservable: toutesEtapes.reservable,
          supplements: supplements,
          montantmax: montantMax,
          dateTheo: dateTheo,
          dateDebut: dateDebut,
          dateFin: dateFin,
          nomartisan: nomA,
          prenomartisan: prenomA,
        };
      })
    );

    // Trie les étapes par numéro croissant pour un affichage ordonné
    listeFinale.sort((a, b) => a.id - b.id);
    return NextResponse.json(listeFinale);
  } catch (error) {
    console.error("Erreur API GET:", error);
    return NextResponse.json(
      { error: "Erreur serveur : " + error.message },
      { status: 500 }
    );
  }
}
