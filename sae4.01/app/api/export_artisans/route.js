import { NextResponse } from "next/server";
import prisma from "../../lib/prisma"; 

// Empêche Next.js de mettre cette route en cache pour toujours avoir des données à jour
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const login = searchParams.get('login');

    if (!login) {
        return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 });
    }

    // 1. On identifie le Maître d'Œuvre qui fait la demande
    const moeConnecte = await prisma.maitre_oeuvre.findFirst({
        where: { login: login }
    });

    if (!moeConnecte) {
        return NextResponse.json({ error: "Maître d'œuvre introuvable" }, { status: 404 });
    }

    // 2. On récupère les affectations avec toutes les jointures nécessaires
    const affectations = await prisma.etape_chantier.findMany({
      where: {
        noartisan: { not: null },
        chantier: {
            nomoe: Number(moeConnecte.nomoe) // Filtre exclusif pour ce MOE
        }
      },
      include: {
        artisan: true,
        etape: true, // Pour le nom de l'étape
        chantier: {
            include: {
                client: true // Pour le nom et prénom du client
            }
        }
      }
    });

    // 3. On utilise une Map pour regrouper les données (1 ligne = 1 artisan sur 1 chantier)
    const uniquePairs = new Map();

    affectations.forEach(aff => {
      const key = `${aff.noartisan}-${aff.nochantier}`;

      // Calcul du prix de l'étape (Montant théorique + Réduction/Supplément)
      const montantBase = parseFloat(aff.montanttheoriquefacture) || 0;
      const reducSuppl = parseFloat(aff.reducsuppl) || 0;
      const prixEtapeFinal = montantBase + reducSuppl;
      
      // Formatage du libellé de l'étape : "Nom de l'étape (Prix€)"
      const etapeFormatee = `${aff.etape.nometape.trim()} (${prixEtapeFinal.toFixed(2)}€)`;

      if (!uniquePairs.has(key)) {
        // Formatage du Client
        const prenomClient = aff.chantier.client.prenomclient ? aff.chantier.client.prenomclient.trim() : "";
        const nomClient = aff.chantier.client.nomclient ? aff.chantier.client.nomclient.trim() : "";
        const clientComplet = `${prenomClient} ${nomClient}`.trim();

        // Formatage de l'Adresse
        const adresse = aff.chantier.adressechantier ? aff.chantier.adressechantier.trim() : "";
        const cp = aff.chantier.cpchantier ? aff.chantier.cpchantier.trim() : "";
        const ville = aff.chantier.villechantier ? aff.chantier.villechantier.trim() : "";
        const adresseComplete = `${adresse}, ${cp} ${ville}`.trim();

        // Création de l'entrée dans la Map
        uniquePairs.set(key, {
          noartisan: aff.noartisan,
          nom: aff.artisan.nomartisan ? aff.artisan.nomartisan.trim() : "",
          prenom: aff.artisan.prenomartisan ? aff.artisan.prenomartisan.trim() : "",
          nochantier: aff.nochantier,
          client: clientComplet,
          adresse: adresseComplete,
          etapes: [etapeFormatee],         // Tableau qui contiendra toutes les étapes
          prixTotalArtisan: prixEtapeFinal // Initialisation du prix total pour ce chantier
        });
      } else {
        // Si la ligne existe déjà (l'artisan a une autre étape sur le même chantier)
        const existing = uniquePairs.get(key);
        existing.etapes.push(etapeFormatee); // On ajoute la nouvelle étape formatée
        existing.prixTotalArtisan += prixEtapeFinal; // On additionne le prix au total
      }
    });

    // 4. On convertit la Map en tableau final pour le JSON
    const resultats = Array.from(uniquePairs.values()).map(row => ({
        ...row,
        // On joint les étapes avec un séparateur lisible (" | ")
        etapes: row.etapes.join(" | "), 
        // On formate le prix total avec 2 décimales et le symbole €
        prixTotalArtisan: row.prixTotalArtisan.toFixed(2) + "€"
    }));
    
    // 5. Tri par ordre alphabétique sur le nom de l'artisan
    resultats.sort((a, b) => a.nom.localeCompare(b.nom));

    return NextResponse.json(resultats);

  } catch (error) {
    console.error("Erreur API export CSV :", error);
    return NextResponse.json({ error: "Erreur serveur interne" }, { status: 500 });
  }
}