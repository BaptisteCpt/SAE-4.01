import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function DELETE(request) {
  try {
    const body = await request.json();
    const { id, login } = body;

    if (!id) {
        return NextResponse.json({ error: "ID requis" });
    }


    await prisma.$transaction([
    prisma.user.delete({
        where: { login: login }
    }),
    prisma.maitre_oeuvre.delete({
        where: { nomoe: parseInt(id) }
    })
    ]);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Erreur suppression MOE");
  }
}