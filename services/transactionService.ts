import { StatusCode } from "@/constants";
import { Transaction, ErrorResponse } from "@/types";

export async function getCheckoutSummary(clientToken: string, employeeToken: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/transaction/checkout/${clientToken}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${employeeToken}`,
    },
  });

  if (res.status !== StatusCode.OK) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }

  const data: Transaction = await res.json();

  return data;
}

export async function checkout(clientToken: string, employeeToken: string): Promise<void> {
  const res = await fetch(`${process.env.BACKEND_URL}/transaction/checkout/${clientToken}`, {
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

export async function getTransactions(token: string): Promise<Transaction[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/transaction`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== StatusCode.OK) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }

  const transactions = (await res.json()) ?? [];

  return transactions;
}
