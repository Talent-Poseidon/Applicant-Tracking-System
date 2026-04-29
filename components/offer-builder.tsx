"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export default function OfferBuilder() {
  const [offerStatus, setOfferStatus] = useState<string>("");

  const handleGenerateOffer = async () => {
    try {
      const response = await fetch("/api/offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "generate" }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate offer");
      }

      const data = await response.json();
      setOfferStatus(`Offer Draft Created with ID: ${data.id}`);
    } catch (error) {
      console.error(error);
      setOfferStatus("Error generating offer");
    }
  };

  const handleSendOffer = async () => {
    try {
      const response = await fetch("/api/offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "send", id: "1" }), // Assuming ID 1 for demonstration
      });

      if (!response.ok) {
        throw new Error("Failed to send offer");
      }

      const data = await response.json();
      setOfferStatus(`Offer Sent with ID: ${data.id}`);
    } catch (error) {
      console.error(error);
      setOfferStatus("Error sending offer");
    }
  };

  const handleAcceptOffer = async () => {
    try {
      const response = await fetch("/api/offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "accept", id: "1" }), // Assuming ID 1 for demonstration
      });

      if (!response.ok) {
        throw new Error("Failed to accept offer");
      }

      const data = await response.json();
      setOfferStatus(`Offer Accepted with ID: ${data.id}`);
    } catch (error) {
      console.error(error);
      setOfferStatus("Error accepting offer");
    }
  };

  const handleDeclineOffer = async () => {
    try {
      const response = await fetch("/api/offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "decline", id: "1" }), // Assuming ID 1 for demonstration
      });

      if (!response.ok) {
        throw new Error("Failed to decline offer");
      }

      const data = await response.json();
      setOfferStatus(`Offer Declined with ID: ${data.id}`);
    } catch (error) {
      console.error(error);
      setOfferStatus("Error declining offer");
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGenerateOffer} data-testid="generate-offer-btn">
        Generate Offer
      </Button>
      <Button onClick={handleSendOffer} data-testid="send-offer-btn">
        Send Offer
      </Button>
      <Button onClick={handleAcceptOffer} data-testid="accept-offer-btn">
        Accept Offer
      </Button>
      <Button onClick={handleDeclineOffer} data-testid="decline-offer-btn">
        Decline Offer
      </Button>
      {offerStatus && (
        <Alert data-testid="offer-status-alert">
          {offerStatus}
        </Alert>
      )}
    </div>
  );
}
