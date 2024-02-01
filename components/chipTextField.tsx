import {
  TextField as MuiTextField,
  TextFieldProps,
  ThemeProvider,
  createTheme,
} from "@mui/material";

export default function ChipTextField({ ...props }: TextFieldProps) {
  const theme = createTheme({
    components: {
      // Name of the component
      MuiOutlinedInput: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            borderRadius: "16px",
            backgroundColor: "#FAFAFA",
          },
          input: {
            padding: "5px 14px",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <MuiTextField
        sx={{
          "& fieldset": { border: "none" },
          fontWeight: "bold",
          minWidth: "70px",
          maxWidth: "70px",
        }}
        InputProps={{ sx: { fontSize: "14px", padding: "1px" } }}
        InputLabelProps={{
          sx: {
            fontSize: "14px",
            fontWeight: "bold",
            top: "-33%",
            "&.MuiInputLabel-shrink": { top: 0 },
          },
        }}
        {...props}
      />
    </ThemeProvider>
  );
}
