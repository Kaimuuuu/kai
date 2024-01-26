import { CheckboxProps, Checkbox as MuiCheckbox } from "@mui/material";

export default function Checkbox({ ...props }: CheckboxProps) {
  return (
    <MuiCheckbox
      sx={{
        color: "#FF6D4D",
        padding: "4px",
        "&.Mui-checked": { color: "#FF6D4D" },
        "&.Mui-disabled": { color: "#FF6D4D" },
      }}
      {...props}
    />
  );
}
