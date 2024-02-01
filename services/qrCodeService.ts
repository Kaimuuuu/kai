import { StatusCode } from "@/constants";
import { ErrorResponse, QrCode } from "@/types";

export async function getQrCode(token: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/token`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== StatusCode.OK) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }

  const qrCodes: QrCode[] = (await res.json()) ?? [];

  return qrCodes;
}

export async function generateQrCode(
  token: string,
  promotionId: string,
  tableNumber: string,
  size: string,
) {
  const res = await fetch(`${process.env.BACKEND_URL}/token`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      promotionId: promotionId,
      tableNumber: Number(tableNumber),
      size: Number(size),
    }),
  });

  if (res.status !== StatusCode.CREATED) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }

  const data: { clientToken: string } = await res.json();

  return data.clientToken;
}
