import { ID_MENU_CATAGORY } from "@/constants";
import { Box, Chip } from "@mui/material";

interface Props {
  tags: string[];
}

export default function Tags({ tags }: Props) {
  const onClick = (tag: string) => {
    const ele = document.getElementById(`${ID_MENU_CATAGORY}_${tag}`);
    ele?.scrollIntoView({ behavior: "smooth" });
  };

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
      {tags.map((tag) => (
        <Chip onClick={() => onClick(tag)} label={tag} key={tag} sx={{ fontWeight: "bold" }} />
      ))}
    </Box>
  );
}
