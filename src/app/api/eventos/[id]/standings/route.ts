import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { playerName, position, points, wins, draws, losses } = body;

  if (!playerName || !position) {
    return NextResponse.json({ error: "Nombre y posición son requeridos" }, { status: 400 });
  }

  const standing = await prisma.standing.create({
    data: {
      eventId: id,
      playerName,
      position,
      points: points || 0,
      wins: wins || 0,
      draws: draws || 0,
      losses: losses || 0,
    },
  });

  return NextResponse.json(standing);
}
