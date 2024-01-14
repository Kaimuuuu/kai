"use client";

import { Typography } from "@mui/material";

export default function Title({ children }: { children: string | number }) {
  return <Typography sx={{ fontSize: "12px", fontWeight: "bold" }}>{children}</Typography>;
}
