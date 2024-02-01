import { Stack } from "@mui/material";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "background.paper",
  boxShadow: 24,
  p: "10px",
  borderRadius: "16px",
  height: "90%",
};

interface Props {
  children: React.ReactNode;
}

export default function LimitHeightModalStack({ children }: Props) {
  return (
    <Stack sx={modalStyle} spacing={"10px"}>
      <>{children}</>
    </Stack>
  );
}
