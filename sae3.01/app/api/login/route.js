import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(request) {
  const { login, mot_de_passe } = await request.json();
  const user = await prisma.user.findUnique({ where: { login } }); /* requete pour récup un utilisateur basé sur son login unique*/

  if (!user || user.mot_de_passe !== mot_de_passe) {
    return NextResponse.json({ error: 'Identifiants invalides' }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
