"use client"

import React from "react";
import OfferBuilder from "@/components/offer-builder";

export default function OfferBuilderPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Offer Builder</h1>
      <OfferBuilder />
    </div>
  );
}
