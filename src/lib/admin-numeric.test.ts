import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sanitizeNonNegativeInteger } from "./admin-numeric";

describe("sanitizeNonNegativeInteger", () => {
  it("removes minus signs and other non-numeric characters from admin quantity input", () => {
    assert.equal(sanitizeNonNegativeInteger("-125"), "125");
    assert.equal(sanitizeNonNegativeInteger("-0a7"), "07");
  });

  it("keeps an empty quantity empty while the admin is entering it", () => {
    assert.equal(sanitizeNonNegativeInteger(""), "");
  });
});