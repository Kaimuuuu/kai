import {
  TextField as MuiTextField,
  TextFieldProps,
  ThemeProvider,
  createTheme,
} from "@mui/material";

export default function TextArea({ ...props }: TextFieldProps) {
  const theme = createTheme({
    components: {
      // Name of the component
      MuiOutlinedInput: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            borderRadius: "16px",
            backgroundColor: "#E6E6E5",
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
        sx={{ "& fieldset": { border: "none" }, fontWeight: "bold" }}
        InputProps={{ sx: { fontSize: "14px", padding: "1px" } }}
        InputLabelProps={{
          sx: {
            fontSize: "14px",
            fontWeight: "bold",
            top: "-15%",
            "&.MuiInputLabel-shrink": { top: 0 },
          },
        }}
        fullWidth
        rows={3}
        multiline
        {...props}
      />
    </ThemeProvider>
  );
}
