import { LOCAL_STORAGE_EMPLOYEE_TOKEN, LOCAL_STORAGE_ROLE, StatusCode } from "@/constants";
import { EmployeeRole, ErrorResponse } from "@/types";

export async function login(email: string, password: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/auth`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (res.status !== StatusCode.CREATED) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }

  const data: { token: string; role: EmployeeRole } = await res.json();

  localStorage.setItem(LOCAL_STORAGE_EMPLOYEE_TOKEN, data.token);
  localStorage.setItem(LOCAL_STORAGE_ROLE, data.role.toString());
}

export async function meClient(token: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/auth/me/client`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== StatusCode.OK) {
    throw new Error();
  }

  const data = await res.json();

  return data;
}

export async function me(token: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/auth/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== StatusCode.OK) {
    throw new Error();
  }

  const data = await res.json();

  return data;
}
