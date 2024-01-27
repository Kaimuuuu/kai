import { Box, Card, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Title from "./typo/title";

interface props {
  itemLength: number;
  onClick?: () => void;
}

export default function ShoppingFixedButton({ itemLength, onClick }: props) {
  return (
    <Card
      sx={{
        display: "flex",
        position: "fixed",
        zIndex: "10",
        bottom: "0",
        right: "0",
        margin: "16px",
        minHeight: "50px",
        minWidth: "50px",
        borderRadius: "100%",
        backgroundColor: "#FFFFFF",
        overflow: "visible",
      }}
    >
      {itemLength !== 0 && (
        <Box
          position={"absolute"}
          zIndex={10}
          sx={{ backgroundColor: "red", paddingX: "6px", borderRadius: "100%", right: "0" }}
        >
          <Title color="white">{itemLength}</Title>
        </Box>
      )}
      <IconButton onClick={onClick} sx={{ margin: "auto" }}>
        <ShoppingCartIcon fontSize="medium" />
      </IconButton>
    </Card>
  );
}
