import { NextResponse } from 'next/server';
import prisma from '../../lib/prisma';

export async function POST(request) {
    const body = await request.json();
    console.log("POST reçu !", body);
    return NextResponse.json({ ok: true });
  }
  