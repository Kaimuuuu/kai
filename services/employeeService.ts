import { CreateEmployeeRequest, Employee, EmployeeRole, UpdateEmployeeRequest } from "@/types";

export async function getEmployees(token: string, role: EmployeeRole): Promise<Employee[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/employee`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  let employees: Employee[] = await res.json();

  return employees.map((employee) => ({
    ...employee,
    editable: role === EmployeeRole.Admin ? true : false,
  }));
}

export async function createEmployee(token: string, req: CreateEmployeeRequest): Promise<string> {
  const res = await fetch(`${process.env.BACKEND_URL}/employee`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(req),
  });

  if (res.status !== 200) {
    throw new Error();
  }

  const data: { generatedPassword: string } = await res.json();

  return data.generatedPassword;
}

export async function updateEmployee(
  token: string,
  req: UpdateEmployeeRequest,
  employeeId: string,
): Promise<void> {
  const res = await fetch(`${process.env.BACKEND_URL}/employee/${employeeId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(req),
  });

  if (res.status !== 200) {
    throw new Error();
  }
}

export async function deleteEmployee(token: string, employeeId: string): Promise<void> {
  const res = await fetch(`${process.env.BACKEND_URL}/employee/${employeeId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== 200) {
    throw new Error();
  }
}
