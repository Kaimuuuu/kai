import { Checkbox as MuiCheckbox } from "@mui/material";

interface Props {
  checked?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function Checkbox({ checked, disabled, onClick }: Props) {
  return (
    <MuiCheckbox
      sx={{
        color: "#FF6D4D",
        padding: "4px",
        "&.Mui-checked": { color: "#FF6D4D" },
        "&.Mui-disabled": { color: "#FF6D4D" },
      }}
      onClick={onClick}
      checked={checked}
      disabled={disabled}
    />
  );
}
