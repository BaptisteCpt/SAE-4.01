import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma'; 
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const info = await request.json();
    const { nom, prenom, mail, mdp, adresse, cp, ville, etapes } = info;

    const aggs = await prisma.artisan.aggregate({ _max: { noartisan: true } });
    const nextId = (aggs._max.noartisan || 0) + 1;
    let listeQualif = undefined; 
    
    if (etapes && Array.isArray(etapes) && etapes.length > 0) {
        listeQualif = {
            create: etapes.map((idEtape) => ({
                etape: { connect: { noetape: parseInt(idEtape) } }
            }))
        };
    }

    const loginArtisan = nom.toLowerCase() + prenom.charAt(0).toLowerCase(); 
    
    // Si l'utilisateur n'a pas tapé de MDP, on utilise le login par défaut
    const passwordToHash = mdp && mdp.trim() !== "" ? mdp : loginArtisan;
    const hashedMdp = await bcrypt.hash(passwordToHash, 12);

    const result = await prisma.$transaction(async (tx) => {
        const NouvelArtisan = await tx.artisan.create({
            data: {
                noartisan: nextId,
                nomartisan: nom.toUpperCase(),
                prenomartisan: prenom,
                adresseartisan: adresse,
                cpartisan: cp,
                villeartisan: ville,
                login: loginArtisan, 
                ...(listeQualif && { etre_qualifie_pour: listeQualif }),
            },
        });

        const NouvelArtisantUser = await tx.user.create({
            data: {
                login: loginArtisan,
                mot_de_passe: hashedMdp,
                role: "artisan",
                nom: nom.toUpperCase(),
                prenom: prenom,
                mail: mail || null,
            },
        });
        
        return { NouvelArtisan, NouvelArtisantUser };
    });

    return NextResponse.json(result);
    
  } catch (error){
    console.error("Erreur création artisan:", error);
    if (error.code === 'P2002') return NextResponse.json({ error: "Cet email ou ce login existe déjà." }, { status: 400 });
    return NextResponse.json({ error: "Erreur serveur lors de la création." }, { status: 500 });
  }
}