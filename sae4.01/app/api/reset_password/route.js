import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request) {
    try {
        const { token, password } = await request.json();

        if (!token || !password) {
            return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
        }

        const user = await prisma.user.findFirst({
            where: { resettoken: token }
        });

        if (!user) {
            return NextResponse.json({ error: 'Lien de réinitialisation invalide ou déjà utilisé' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: {
                mot_de_passe: hashedPassword,
                resettoken: null
            }
        });

        return NextResponse.json({ message: 'Mot de passe réinitialisé avec succès' }, { status: 200 });

    } catch (error) { 
        console.error(error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}