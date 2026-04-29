import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface OfferRequestBody {
  action: string;
  id?: string;
  outcome?: string;
}

export async function POST(request: NextRequest) {
  const { action, id, outcome }: OfferRequestBody = await request.json();

  if (action === "generate") {
    const newOffer = await prisma.offer.create({
      data: { status: "draft" },
    });
    return NextResponse.json(newOffer, { status: 201 });
  }

  if (action === "send" && id) {
    try {
      const offer = await prisma.offer.update({
        where: { id },
        data: { status: "sent" },
      });
      return NextResponse.json(offer, { status: 200 });
    } catch (e: any) {
      if (e.code === "P2025") return NextResponse.json({ error: "Offer not found" }, { status: 404 });
      throw e;
    }
  }

  if (action === "accept" && id) {
    try {
      const offer = await prisma.offer.update({
        where: { id },
        data: { status: "accepted" },
      });
      return NextResponse.json(offer, { status: 200 });
    } catch (e: any) {
      if (e.code === "P2025") return NextResponse.json({ error: "Offer not found" }, { status: 404 });
      throw e;
    }
  }

  if (action === "decline" && id) {
    try {
      const offer = await prisma.offer.update({
        where: { id },
        data: { status: "declined" },
      });
      return NextResponse.json(offer, { status: 200 });
    } catch (e: any) {
      if (e.code === "P2025") return NextResponse.json({ error: "Offer not found" }, { status: 404 });
      throw e;
    }
  }

  if (action === "interview" && id && outcome) {
    try {
      const offer = await prisma.offer.update({
        where: { id },
        data: { status: outcome === "passed" ? "accepted" : "declined" },
      });
      return NextResponse.json(offer, { status: 200 });
    } catch (e: any) {
      if (e.code === "P2025") return NextResponse.json({ error: "Offer not found" }, { status: 404 });
      throw e;
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
