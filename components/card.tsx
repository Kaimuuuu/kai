import { Box } from "@mui/material";
import Title from "./typo/title";

interface Props {
  label: string | number;
  bgcolor?: string;
  color?: string;
}

export default function Card({ label, bgcolor, color }: Props) {
  return (
    <Box
      sx={{
        px: "6px",
        py: "2px",
        borderRadius: "16px",
        backgroundColor: bgcolor ? bgcolor : "#FF6D4D",
        color: color ? color : "#FFFFFF",
      }}
    >
      <Title>{label}</Title>
    </Box>
  );
}
