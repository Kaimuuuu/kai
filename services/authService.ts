import { LOCAL_STORAGE_EMPLOYEE_TOKEN, LOCAL_STORAGE_ROLE } from "@/constants";
import { EmployeeRole } from "@/types";

export async function login(email: string, password: string) {
  const res = await fetch(`${process.env.BACKEND_URL}/auth/sign-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (res.status !== 200) {
    throw new Error();
  }

  const data: { token: string; role: EmployeeRole } = await res.json();

  localStorage.setItem(LOCAL_STORAGE_EMPLOYEE_TOKEN, data.token);
  localStorage.setItem(LOCAL_STORAGE_ROLE, data.role.toString());
}
