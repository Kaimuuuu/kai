"use client";

import { Typography } from "@mui/material";

export default function Title({ children, color }: { children: string | number; color?: string }) {
  return (
    <Typography sx={{ fontSize: "12px", fontWeight: "bold", color: color ? color : "inherit" }}>
      {children}
    </Typography>
  );
}
