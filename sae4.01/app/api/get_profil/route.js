import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';

// 1. Interdit à Next.js de mettre en cache (garder en mémoire) cette réponse
export const dynamic = 'force-dynamic'; 

export async function GET(request) {
    try {
        // 2. On récupère le "?login=toto" dans l'adresse de l'API
        const { searchParams } = new URL(request.url);
        const login = searchParams.get('login');

        // 3. Sécurité de base : s'il n'y a pas de login, on arrête tout
        if (!login) {
            return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 });
        }

        // 4. On demande à Prisma de chercher l'utilisateur qui a ce login
        const user = await prisma.user.findUnique({
            where: { login: login },
            select: { // On choisit précisément les colonnes à renvoyer (pas le mot de passe !)
                nom: true,
                prenom: true,
                login: true,
                mail: true,
                role: true
            }
        });

        // 5. Si l'utilisateur n'existe pas dans la base de données
        if (!user) {
            return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
        }

        // 6. Si tout est bon, on renvoie les données de l'utilisateur !
        return NextResponse.json(user, { status: 200 });

    } catch (error) {
        // 7. S'il y a un bug (ex: base de données éteinte), on gère l'erreur
        console.error("Erreur API profil :", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}