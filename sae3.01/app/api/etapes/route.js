import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const idChantier = parseInt(searchParams.get('chantier'));

    if (!idChantier) {
        return NextResponse.json({ error: "Numéro de chantier manquant" }, { status: 400 });
    }

    try {     
        const chantierData = await prisma.chantier.findUnique({
            where: { nochantier: idChantier },
            include: {
                modele: {
                    include: {
                        construire: {
                            include: { etape: true } 
                        }
                    }
                },
                etape_chantier: true 
            }
        });

        if (!chantierData) {
            return NextResponse.json({ error: "Chantier introuvable" }, { status: 404 });
        }

        if (!chantierData.modele) {
            return NextResponse.json({ error: "Aucun modèle associé à ce chantier" }, { status: 404 });
        }

        const listeFinale = await Promise.all( chantierData.modele.construire.map(async lien => {
            const toutesEtapes = lien.etape; /* récup de toutes les étapes existantes puis verif de si elles existes dans notre chantier */
            const perso = chantierData.etape_chantier.find(p => p.noetape === toutesEtapes.noetape);

            const supplements = [];
            let isReserved = false;
            let dateTheo = null;
            let dateDebut = null;
            let dateFin = null;
            let nomA = null;
            let prenomA = null;

            if (perso) {
                isReserved = perso.reservee;
                const montant = parseFloat(perso.reducsuppl);
                dateTheo = perso.datedebuttheorique;
                dateDebut = perso.datedebut;
                dateFin = perso.datefin;

                if (perso?.noartisan != null) {
                    const artisan = await prisma.artisan.findUnique({
                      where: { noartisan: perso.noartisan }
                    });
                  
                let nomA, prenomA;
                if (artisan) {
                    nomA = artisan.nomartisan;
                    prenomA = artisan.prenomartisan;
                } 
                }          

                if (montant !== 0) {
                    supplements.push({
                        id: 999,
                        label: perso.descriptionreducsuppl || "Ajustement existant",
                        price: Math.abs(montant),
                        type: montant > 0 ? 'plus' : 'moins'
                    });
                }
            }

            return {
                id: toutesEtapes.noetape,
                nom: toutesEtapes.nometape.trim(),
                description: chantierData.modele.descriptionmodele || "Étape standard", 
                reservee: isReserved,
                isReservable: toutesEtapes.reservable,
                supplements: supplements,
                dateTheo: dateTheo,
                dateDebut: dateDebut,
                dateFin: dateFin,
                nomartisan: nomA,
                prenomartisan: prenomA
            };
        }));

        listeFinale.sort((a, b) => a.id - b.id);
        return NextResponse.json(listeFinale);

    } catch (error) {
        console.error("Erreur API GET:", error);
        return NextResponse.json({ error: "Erreur serveur : " + error.message }, { status: 500 });
    }
}