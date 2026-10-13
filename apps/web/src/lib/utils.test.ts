/** Runs on Vitest: the class merger and the two small formatters every screen leans on. */
import { describe, expect, it } from "vitest";
import { cn, discountPercent, slugify } from "./utils";

describe("cn", () => {
  it("lets the later Tailwind class win a conflict", () => {
    expect(cn("px-2 text-muted-foreground", "px-4")).toBe("text-muted-foreground px-4");
  });

  it("drops falsy values", () => {
    expect(cn("rounded-tile", false, undefined, null, "shadow-tile")).toBe("rounded-tile shadow-tile");
  });
});

describe("discountPercent", () => {
  it("rounds the saving to a whole percent", () => {
    expect(discountPercent(27.49, 29.99)).toBe(8);
  });

  it("is zero when the item is not on sale", () => {
    expect(discountPercent(10, 0)).toBe(0);
    expect(discountPercent(10, 9)).toBe(0);
  });
});

describe("slugify", () => {
  it("turns a label into a URL-safe slug", () => {
    expect(slugify("Kent Strawberries — Sweet & Tart")).toBe("kent-strawberries-sweet-tart");
  });
});
