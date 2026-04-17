import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, description, type, status, startDate, endDate, maxPlayers } = body;

  if (!name || !startDate) {
    return NextResponse.json({ error: "Nombre y fecha de inicio son requeridos" }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      name,
      description,
      type: type || "FREE",
      status: status || "DRAFT",
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      maxPlayers: maxPlayers || null,
    },
  });

  return NextResponse.json(event);
}
