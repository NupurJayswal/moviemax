export interface CouponResult {
  valid: boolean;
  discount: number;
  message: string;
}

export const calculateCoupon = (
  code: string,
  subtotal: number,
  seatCount: number
): CouponResult => {
  const normalizedCode = code.trim().toUpperCase();

  if (!normalizedCode) {
    return {
      valid: true,
      discount: 0,
      message: "",
    };
  }

  if (normalizedCode === "SAVE10") {
    return {
      valid: true,
      discount: Math.round(subtotal * 0.1),
      message: "10% discount applied.",
    };
  }

  if (normalizedCode === "FLAT200") {
    if (seatCount < 3) {
      return {
        valid: false,
        discount: 0,
        message: "FLAT200 requires at least 3 seats.",
      };
    }

    return {
      valid: true,
      discount: 200,
      message: "₹200 discount applied.",
    };
  }

  return {
    valid: false,
    discount: 0,
    message: "Invalid coupon code.",
  };
};