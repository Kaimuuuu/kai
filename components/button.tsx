import { ButtonProps, Button as MuiButton } from "@mui/material";
import Title from "./typo/title";

interface Props {
  label: string;
  myVariant?: "primary" | "secondary" | "danger";
}

export default function Button({ label, myVariant, ...props }: Props & ButtonProps) {
  return (
    <MuiButton
      sx={{
        ":hover": {
          backgroundColor:
            myVariant !== "secondary"
              ? myVariant === "danger"
                ? "#D12600"
                : "#FF6D4D"
              : "#E6E6E5",
        },
        backgroundColor:
          myVariant !== "secondary" ? (myVariant === "danger" ? "#D12600" : "#FF6D4D") : "#E6E6E5",
        borderRadius: "32px",
        fontWeight: "bold",
        minWidth: "0px",
        color: myVariant === "secondary" ? "black" : "white",
      }}
      variant="contained"
      disableElevation
      fullWidth
      {...props}
    >
      <Title>{label}</Title>
    </MuiButton>
  );
}
