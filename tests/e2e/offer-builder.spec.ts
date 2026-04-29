import { test, expect } from "@playwright/test";

test.describe("OfferBuilder Page", () => {
  test("should create a new offer draft", async ({ page }) => {
    await page.goto("/offer-builder");

    // Click on 'Generate Offer'
    await page.getByTestId("generate-offer-btn").click();

    // Verify offer status
    await expect(page.getByTestId("offer-status-alert")).toHaveText(
      /Offer Draft Created with ID: \d+/
    );
  });

  test("should send an offer", async ({ page }) => {
    await page.goto("/offer-builder");

    // Click on 'Send Offer'
    await page.getByTestId("send-offer-btn").click();

    // Verify offer status
    await expect(page.getByTestId("offer-status-alert")).toHaveText(
      /Offer Sent with ID: \d+/
    );
  });

  test("should accept an offer", async ({ page }) => {
    await page.goto("/offer-builder");

    // Click on 'Accept Offer'
    await page.getByTestId("accept-offer-btn").click();

    // Verify offer status
    await expect(page.getByTestId("offer-status-alert")).toHaveText(
      /Offer Accepted with ID: \d+/
    );
  });

  test("should decline an offer", async ({ page }) => {
    await page.goto("/offer-builder");

    // Click on 'Decline Offer'
    await page.getByTestId("decline-offer-btn").click();

    // Verify offer status
    await expect(page.getByTestId("offer-status-alert")).toHaveText(
      /Offer Declined with ID: \d+/
    );
  });
});
