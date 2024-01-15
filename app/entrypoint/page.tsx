"use client"

import { LOCAL_STORAGE_CLIENT_TOKEN } from "@/constants";
import { useSearchParams, useRouter } from "next/navigation";

export default function Entrypoint() {
  const router = useRouter();
  const searchParams  = useSearchParams()
  const token = searchParams.get("token")

  if (token) {
    localStorage.setItem(LOCAL_STORAGE_CLIENT_TOKEN, token);
  }

  router.push("/")
}