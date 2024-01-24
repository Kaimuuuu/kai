"use client";

import { LOCAL_STORAGE_CLIENT_TOKEN } from "@/constants";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Entrypoint() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem(LOCAL_STORAGE_CLIENT_TOKEN, token);
    }
  }, []);

  router.push("/");
}
