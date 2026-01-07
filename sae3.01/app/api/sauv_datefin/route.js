import prisma from '../../lib/prisma';
import { NextResponse } from 'next/server';

function parseDateISO(date) {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

export async function POST(req) {
  try {
    const { chantierId, etapeId, dateFin } = await req.json();

    if (!chantierId || !etapeId || !dateFin) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    const updated = await prisma.etape_chantier.update({
      where: { nochantier_noetape: { nochantier: chantierId, noetape: etapeId } },
      data: { datefin: parseDateISO(dateFin) },
    });

    return NextResponse.json({ message: 'Date fin mise à jour', updated }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
