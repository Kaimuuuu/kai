import {
  EMPLOYEE_ROLE_NAME_ADMIN,
  EMPLOYEE_ROLE_NAME_CHEF,
  EMPLOYEE_ROLE_NAME_WAITER,
} from "@/constants";
import { EmployeeRole, EmployeeRoleName } from "@/types";

export function employeeRoleToEmployeeRoleName(role: EmployeeRole): EmployeeRoleName {
  switch (role) {
    case EmployeeRole.Admin: {
      return EMPLOYEE_ROLE_NAME_ADMIN;
    }
    case EmployeeRole.Chef: {
      return EMPLOYEE_ROLE_NAME_CHEF;
    }
    case EmployeeRole.Waiter: {
      return EMPLOYEE_ROLE_NAME_WAITER;
    }
    default: {
      return EMPLOYEE_ROLE_NAME_WAITER;
    }
  }
}

export function employeeRoleNameToEmployeeRole(roleName: EmployeeRoleName): EmployeeRole {
  switch (roleName) {
    case EMPLOYEE_ROLE_NAME_ADMIN: {
      return EmployeeRole.Admin;
    }
    case EMPLOYEE_ROLE_NAME_CHEF: {
      return EmployeeRole.Chef;
    }
    case EMPLOYEE_ROLE_NAME_WAITER: {
      return EmployeeRole.Waiter;
    }
    default: {
      return EmployeeRole.Waiter;
    }
  }
}
