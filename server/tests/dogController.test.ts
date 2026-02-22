
import { describe, it, expect, vi, afterEach } from "vitest";
import { getDogImage } from "../controllers/dogController";
import * as dogService from "../services/dogService";

describe("dogController", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test 3: Positive test
  it("should return success true and service data", async () => {
    const mockData = {
      imageUrl: "https://images.dog.ceo/breeds/stbernard/n02109525_15579.jpg",
      status: "success",
    };

    vi.spyOn(dogService, "getRandomDogImage").mockResolvedValue(mockData);

    const req: any = {};
    const res: any = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis(),
    };

    await getDogImage(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: mockData,
      })
    );
  });
});