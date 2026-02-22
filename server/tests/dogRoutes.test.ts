

import { describe, it, expect, vi, afterEach } from "vitest";
import request from "supertest";
import express from "express";

vi.mock("../controllers/dogController", () => ({
  getDogImage: vi.fn(),
}));

import * as dogController from "../controllers/dogController";
import dogRouter from "../routes/dogRoutes";

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/api/dogs", dogRouter);
  return app;
};

describe("dogRoutes", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test 4: Positive test
  it("should return status 200 with success true and image url", async () => {
    const mockImageUrl =
      "https://images.dog.ceo/breeds/stbernard/n02109525_15579.jpg";

    vi.mocked(dogController.getDogImage).mockImplementation(
      async (_req: any, res: any) => {
        res.json({
          success: true,
          data: {
            imageUrl: mockImageUrl,
            status: "success",
          },
        });
      }
    );

    const response = await request(buildApp()).get("/api/dogs/random");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.imageUrl).toContain(mockImageUrl);
  });

  // Test 5: Negative test
  it("should return status 500 with error message", async () => {
    vi.mocked(dogController.getDogImage).mockImplementation(
      async (_req: any, res: any) => {
        res.status(500).json({
          success: false,
          error: "Failed to fetch dog image: Network error",
        });
      }
    );

    const response = await request(buildApp()).get("/api/dogs/random");

    expect(response.status).toBe(500);
    expect(response.body.error).toBeDefined();
  });
});