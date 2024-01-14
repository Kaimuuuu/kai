import { Box } from "@mui/material";
import RecommandCard from "./recommandCard";
import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { getRecommand } from "@/services/menuService";
import { MenuItem } from "@/types";

export default function Recommands() {
  const [recommands, setRecommands] = useState<MenuItem[]>([]);
  const [token, setToken] = useLocalStorage("clientToken", "");

  useEffect(() => {
    getRecommand(token)
      .then((menus) => setRecommands(menus))
      .catch((err) => console.log(err));
  }, [token]);

  return (
    <Box
      sx={{
        display: "inline-flex",
        gap: "10px",
        width: "100%",
        overflowX: "auto",
        paddingTop: "12px",
        paddingBottom: "12px",
      }}
    >
      {recommands.map((recommand) => (
        <RecommandCard
          key={recommand.id}
          imagePath={recommand.imagePath}
          menuItemId={recommand.id}
        />
      ))}
    </Box>
  );
}
