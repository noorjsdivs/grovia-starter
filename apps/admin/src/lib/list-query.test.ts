/**
 * Runs on Vitest: `pnpm --filter admin test`.
 */
import { describe, expect, it } from "vitest";
import { listHref } from "./list-query";

describe("listHref", () => {
  it("omits empty values, page one and defaults", () => {
    expect(listHref("/orders", { q: "", status: "", page: 1, sort: "newest", perPage: 20 }, { sort: "newest", perPage: 20, page: 1 })).toBe("/orders");
  });
  it("keeps what differs from the defaults", () => {
    expect(listHref("/orders", { q: "amelia", status: "pending", page: 2, sort: "oldest", perPage: 50 }, { sort: "newest", perPage: 20, page: 1 })).toBe("/orders?q=amelia&status=pending&page=2&sort=oldest&perPage=50");
  });
  it("encodes values", () => {
    expect(listHref("/search", { q: "a b&c" })).toBe("/search?q=a+b%26c");
  });
});
