import { describe, expect, it } from "vitest";
import { findErrors } from "./findErrors";
import { z } from "zod";

describe("findErrors", () => {
  it("returns an empty array when errors is a string", () => {
    expect(findErrors("title", "Some error message")).toEqual([]);
  });

  it("filters Zod issues by field path and returns messages", () => {
    const issues: z.ZodIssue[] = [
      { code: "invalid_type", path: ["title"], message: "Title is required" },
      { code: "too_small", path: ["description"], message: "Description is too short" },
      { code: "invalid_type", path: ["title", "nested"], message: "Nested title failed" },
    ];

    expect(findErrors("title", issues)).toEqual(["Title is required", "Nested title failed"]);
  });
});
