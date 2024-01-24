import { DEFAULT_EMPLOYEE_TOKEN, LOCAL_STORAGE_EMPLOYEE_TOKEN } from "@/constants";
import useLocalStorage from "./useLocalStorage";

export default function useEmployeeToken(): string {
  const [token] = useLocalStorage(LOCAL_STORAGE_EMPLOYEE_TOKEN, DEFAULT_EMPLOYEE_TOKEN);

  return token;
}
