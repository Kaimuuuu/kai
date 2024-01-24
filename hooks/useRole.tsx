import { LOCAL_STORAGE_ROLE } from "@/constants";
import useLocalStorage from "./useLocalStorage";
import { EmployeeRole } from "@/types";

export default function useRole(): EmployeeRole {
  const [role, setRole] = useLocalStorage(LOCAL_STORAGE_ROLE, EmployeeRole.Default.toString());

  return Number(role);
}
