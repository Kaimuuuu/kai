import { StatusCode } from "@/constants";
import { CheckoutSummaryObject, ErrorResponse, OrderItem, QrCode } from "@/types";

export async function getQrCode(token: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/client`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const qrCodes: QrCode[] = await res.json();

  return qrCodes;
}

export async function getCheckoutSummary(clientToken: string, employeeToken: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/client/checkout/${clientToken}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${employeeToken}`,
    },
  });

  const data: CheckoutSummaryObject = await res.json();

  return data;
}

export async function checkout(clientToken: string, employeeToken: string): Promise<void> {
  const res = await fetch(`${process.env.BACKEND_URL}/client/checkout/${clientToken}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${employeeToken}`,
    },
  });

  if (res.status !== StatusCode.CREATED) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }
}
