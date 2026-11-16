import { describe, expect, it } from "bun:test";
import { sanitizeNonNegativeInteger } from "./admin-numeric";

describe("sanitizeNonNegativeInteger", () => {
  it("removes minus signs and other non-numeric characters from admin quantity input", () => {
    expect(sanitizeNonNegativeInteger("-125")).toBe("125");
    expect(sanitizeNonNegativeInteger("-0a7")).toBe("07");
  });

  it("keeps an empty quantity empty while the admin is entering it", () => {
    expect(sanitizeNonNegativeInteger("")).toBe("");
  });
});