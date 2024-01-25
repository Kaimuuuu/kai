import { Box, Container } from "@mui/material";

export default function ErrorClientToken() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container>
        <Box sx={{ margin: "auto", textAlign: "center" }}>
          คุณไม่มีสิทธิสั่งอาหาร (กรุณาเรียกพนักงานหากเกิดข้อผิดพลาด)
        </Box>
      </Container>
    </main>
  );
}
