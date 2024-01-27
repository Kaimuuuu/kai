import { Typography } from "@mui/material";

export default function Body({ children, bold }: { children: string | number; bold?: boolean }) {
  return (
    <Typography sx={{ fontSize: "11px", fontWeight: bold ? "bold" : "regular" }}>
      {children}
    </Typography>
  );
}
