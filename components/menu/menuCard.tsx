import { Chip, Stack, Card as MuiCard, Box } from "@mui/material";
import Button from "../button";
import SubHeading from "../typo/subHeading";
import Body from "../typo/body";
import { MenuItem } from "@/types";
import Card from "../card";
import { ID_MENU_CARD } from "@/constants";
import MyImage from "../image";

interface Props {
  menuItem: MenuItem;
  quantity: number;
  onAdd: (menuItem: MenuItem) => void;
  onRemove: (menuItemId: string) => void;
}

export default function MenuCard({ menuItem, quantity, onAdd, onRemove }: Props) {
  return (
    <MuiCard
      sx={{
        borderRadius: "16px",
        width: "100%",
        opacity: menuItem.outOfStock ? "70%" : "100%",
      }}
      id={`${ID_MENU_CARD}_${menuItem.id}`}
    >
      <Stack sx={{ padding: "12px" }} spacing="12px">
        <Stack direction={"row"} spacing="12px">
          <div>
            {menuItem.outOfStock && (
              <Box sx={{ position: "absolute", p: "4px" }}>
                <Card label={"หมด"} bgcolor="#D12600" />
              </Box>
            )}
            <div
              style={{
                maxWidth: "130px",
                maxHeight: "130px",
                borderRadius: "16px",
                overflow: "hidden",
                height: "fit-content",
              }}
            >
              <MyImage imagePath={menuItem.imagePath} />
            </div>
          </div>
          <Stack sx={{ width: "100%" }}>
            <SubHeading>{menuItem.name}</SubHeading>
            <Body>{menuItem.description}</Body>
            <Stack direction={"row"} alignItems={"center"} sx={{ marginTop: "auto" }}>
              <Body bold>{`ราคา: ${menuItem.price}฿`}</Body>
              <Stack
                alignItems={"center"}
                direction={"row"}
                sx={{ marginLeft: "auto" }}
                spacing={0.2}
              >
                <Button
                  label="-"
                  disabled={menuItem.outOfStock}
                  onClick={() => onRemove(menuItem.id)}
                />
                <Chip label={String(quantity).padStart(2, "0")} />
                <Button
                  label="+"
                  disabled={menuItem.outOfStock || quantity >= menuItem.limit}
                  onClick={() => onAdd(menuItem)}
                />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </MuiCard>
  );
}
