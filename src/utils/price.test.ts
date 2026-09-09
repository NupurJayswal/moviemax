import { describe, expect, it } from "vitest";

import { calculateCoupon } from "./price";

describe("calculateCoupon", () => {
  it("should apply 10% discount for SAVE10", () => {
    const result = calculateCoupon("SAVE10", 1000, 2);

    expect(result.valid).toBe(true);
    expect(result.discount).toBe(100);
  });

  it("should apply ₹200 discount for FLAT200 with 3 seats", () => {
    const result = calculateCoupon("FLAT200", 1000, 3);

    expect(result.valid).toBe(true);
    expect(result.discount).toBe(200);
  });

  it("should reject FLAT200 when fewer than 3 seats are selected", () => {
    const result = calculateCoupon("FLAT200", 1000, 2);

    expect(result.valid).toBe(false);
    expect(result.discount).toBe(0);
  });

  it("should reject an invalid coupon", () => {
    const result = calculateCoupon("INVALID", 1000, 2);

    expect(result.valid).toBe(false);
    expect(result.discount).toBe(0);
  });

  it("should accept lowercase coupon codes", () => {
    const result = calculateCoupon("save10", 1000, 2);

    expect(result.valid).toBe(true);
    expect(result.discount).toBe(100);
  });

  it("should return no discount when coupon is empty", () => {
    const result = calculateCoupon("", 1000, 2);

    expect(result.valid).toBe(true);
    expect(result.discount).toBe(0);
  });
});