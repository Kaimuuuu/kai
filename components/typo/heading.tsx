"use client";

import { Typography } from "@mui/material";

export default function Heading({ children }: { children: string }) {
  return <Typography sx={{ fontSize: "16px", fontWeight: "bold" }}>{children}</Typography>;
}
