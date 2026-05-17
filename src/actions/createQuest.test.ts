import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createQuest } from "./createQuest";

const originalFetch = global.fetch;

describe("createQuest action", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    process.env.API_BASE_URL = "https://api.example.com";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
  });

  it("returns validation errors when form data is invalid", async () => {
    const formData = new FormData();
    formData.append("title", "");
    formData.append("description", "");
    formData.append("previewImg", "");
    formData.append("coverImg", "");
    formData.append("type", "");
    formData.append("level", "");
    formData.append("peopleCount", "");
    formData.append("duration", "0");

    const result = await createQuest({}, formData);

    expect(result.success).toBe(false);
    expect(result.message).toBeInstanceOf(Array);
  });

  it("succeeds when fetch returns ok", async () => {
    const mockFetch = vi.mocked(global.fetch as unknown as typeof fetch);
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as unknown as Response);

    const formData = new FormData();
    formData.append("title", "Test quest");
    formData.append("description", "Test description");
    formData.append("previewImg", "preview.png");
    formData.append("coverImg", "cover.png");
    formData.append("type", "adventure");
    formData.append("level", "easy");
    formData.append("peopleCount", "2,4");
    formData.append("duration", "60");

    const result = await createQuest({}, formData);

    expect(result).toEqual({
      success: true,
      message: 'Quest "Test quest" created successfully',
    });
    expect(mockFetch).toHaveBeenCalledWith(
      "https://api.example.com/api/create-quest",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("returns a failure result when fetch returns non-ok response", async () => {
    const mockFetch = vi.mocked(global.fetch as unknown as typeof fetch);
    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Bad request" }),
    } as unknown as Response);

    const formData = new FormData();
    formData.append("title", "Test quest");
    formData.append("description", "Test description");
    formData.append("previewImg", "preview.png");
    formData.append("coverImg", "cover.png");
    formData.append("type", "adventure");
    formData.append("level", "easy");
    formData.append("peopleCount", "2,4");
    formData.append("duration", "60");

    const result = await createQuest({}, formData);

    expect(result).toEqual({ success: false, message: "Bad request" });
  });
});
