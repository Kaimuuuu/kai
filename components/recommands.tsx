import { Box } from "@mui/material";
import RecommandCard from "./recommandCard";
import { useEffect, useState } from "react";
import { getRecommand } from "@/services/menuService";
import { MenuItem } from "@/types";
import useClientToken from "@/hooks/useClientToken";

export default function Recommands() {
  const [recommands, setRecommands] = useState<MenuItem[]>([]);
  const token = useClientToken();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshing = () => {
    setRefresh(!refresh);
  };

  useEffect(() => {
    if (token) {
      getRecommand(token)
        .then((menus) => {
          setRecommands(menus);
          setIsLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [token, refresh]);

  useEffect(() => {
    if (!isLoading) {
      const pollingId = setInterval(
        () => {
          refreshing();
        },
        15 * 60 * 1e3,
      );

      return () => clearInterval(pollingId);
    }
  }, [refresh, isLoading]);

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
