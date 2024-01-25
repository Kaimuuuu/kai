import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box sx={{ margin: "auto" }}>
        <CircularProgress />
      </Box>
    </main>
  );
}
