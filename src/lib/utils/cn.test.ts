import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn utility", () => {
  it("merges class names and removes duplicates correctly", () => {
    expect(cn("btn", "btn-primary", "btn", "mt-4")).toBe("btn btn-primary btn mt-4");
  });

  it("ignores falsy values like undefined and false", () => {
    expect(cn("text-lg", undefined, "font-bold", false)).toBe("text-lg font-bold");
  });
});
