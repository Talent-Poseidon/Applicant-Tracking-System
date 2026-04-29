import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Define the type for the request body
interface OfferRequestBody {
  action: string;
  id?: string;
  outcome?: string;
}

// POST handler for generating a new offer
export async function POST(request: NextRequest) {
  const { action, id, outcome }: OfferRequestBody = await request.json();

  if (action === "generate") {
    const newOffer = await prisma.offer.create({
      data: {
        status: "draft",
      },
    });
    return NextResponse.json(newOffer, { status: 201 });
  }

  if (action === "send" && id) {
    const offer = await prisma.offer.update({
      where: { id },
      data: { status: "sent" },
    });
    return NextResponse.json(offer, { status: 200 });
  }

  if (action === "accept" && id) {
    const offer = await prisma.offer.update({
      where: { id },
      data: { status: "accepted" },
    });
    return NextResponse.json(offer, { status: 200 });
  }

  if (action === "decline" && id) {
    const offer = await prisma.offer.update({
      where: { id },
      data: { status: "declined" },
    });
    return NextResponse.json(offer, { status: 200 });
  }

  if (action === "interview" && id && outcome) {
    const offer = await prisma.offer.update({
      where: { id },
      data: { status: outcome === "passed" ? "accepted" : "declined" },
    });
    return NextResponse.json(offer, { status: 200 });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
