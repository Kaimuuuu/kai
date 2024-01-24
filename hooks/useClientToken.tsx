import { DEFAULT_CLIENT_TOKEN, LOCAL_STORAGE_CLIENT_TOKEN } from "@/constants";
import useLocalStorage from "./useLocalStorage";

export default function useClientToken(): string {
  const [token] = useLocalStorage(LOCAL_STORAGE_CLIENT_TOKEN, DEFAULT_CLIENT_TOKEN);

  return token;
}
