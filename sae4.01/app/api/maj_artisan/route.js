import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';
import bcrypt from 'bcrypt';

export async function PUT(request) {
  try {
    const body = await request.json();
    const { id, nom, prenom, mail, mdp, adresse, cp, ville, etapes } = body;

    const result = await prisma.$transaction(async (tx) => {
        const currentArtisan = await tx.artisan.findUnique({
            where: { noartisan: parseInt(id) }
        });

        if (!currentArtisan) {
            throw new Error("ARTISAN_NOT_FOUND");
        }
        
        const newLogin = nom.toLowerCase() + prenom.charAt(0).toLowerCase();

        const updatedArtisan = await tx.artisan.update({
            where: { noartisan: parseInt(id) },
            data: {
                nomartisan: nom.toUpperCase(),
                prenomartisan: prenom,
                adresseartisan: adresse,
                cpartisan: cp,
                villeartisan: ville,
                login: newLogin,
                etre_qualifie_pour: {
                    deleteMany: {}, 
                    create: etapes.map((idEtape) => ({ 
                        etape: { connect: { noetape: parseInt(idEtape) } }
                    }))
                }
            },
        });

        const loginRecherche = currentArtisan.login || newLogin;
        
        // On prépare l'objet de mise à jour pour le User
        let dataToUpdateUser = {
            nom: nom.toUpperCase(),
            prenom: prenom,
            login: newLogin,
            mail: mail || null
        };

        // Si un mot de passe a été tapé, on le crypte et on l'ajoute à la mise à jour
        if (mdp && mdp.trim() !== "") {
            const hashedMdp = await bcrypt.hash(mdp, 12);
            dataToUpdateUser.mot_de_passe = hashedMdp;
        }

        // Variable pour la création (upsert), s'il n'existe pas on le crée avec le mdp ou le login
        const passwordForCreation = (mdp && mdp.trim() !== "") ? mdp : newLogin;
        const hashForCreation = await bcrypt.hash(passwordForCreation, 12);

        const updatedUser = await tx.user.upsert({
            where: { login: loginRecherche }, 
            update: dataToUpdateUser, // Applique la mise à jour conditionnelle du mot de passe
            create: {
                login: newLogin,
                mot_de_passe: hashForCreation,
                role: "artisan",
                nom: nom.toUpperCase(),
                prenom: prenom,
                mail: mail 
            }
        });

        return { updatedArtisan, updatedUser };
    });

    return NextResponse.json(result);
    
  } catch (error) {
    console.error("Erreur de mise à jour Artisan :", error);
    if (error.code === 'P2002') return NextResponse.json({ error: "Cet email ou identifiant est déjà utilisé." }, { status: 400 });
    if (error.message === "ARTISAN_NOT_FOUND") return NextResponse.json({ error: "Artisan introuvable." }, { status: 404 });
    return NextResponse.json({ error: "Erreur lors de la modification" }, { status: 500 });
  }
}