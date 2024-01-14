"use client";

import { Typography } from "@mui/material";

export default function SubHeading({ children }: { children: string }) {
  return <Typography sx={{ fontSize: "14px", fontWeight: "bold" }}>{children}</Typography>;
}
