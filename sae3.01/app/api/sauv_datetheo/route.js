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
    const { chantierId, etapeId, dateTheo } = await req.json();

    if (!chantierId || !etapeId || !dateTheo) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    const updated = await prisma.etape_chantier.update({
      where: { nochantier_noetape: { nochantier: parseInt(chantierId), noetape: etapeId } },
      data: { datedebuttheorique: parseDateISO(dateTheo) },
    });

    return NextResponse.json({ message: 'Date théorique mise à jour', updated }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}
