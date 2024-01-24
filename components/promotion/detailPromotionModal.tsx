import { Box, MenuItem, Modal, Select, Stack } from "@mui/material";
import ModalStack from "../modalStack";
import TextField from "../textField";
import Title from "../typo/title";
import Button from "../button";
import { Promotion, PromotionMenuItem, PromotionMenuItemType } from "@/types";
import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import TextArea from "../textArea";
import { getPromotionMenuItems } from "@/services/promotionService";
import { nanoSecondToHourMinute } from "@/util/duration";
import {
  LOCAL_STORAGE_EMPLOYEE_TOKEN,
  SELECT_LABEL_PROMOTION_MENU_ITEM_ALACARTE,
  SELECT_LABEL_PROMOTION_MENU_ITEM_BUFFET,
  SELECT_LABEL_PROMOTION_MENU_ITEM_DEFAULT,
  SELECT_LABEL_PROMOTION_MENU_ITEM_NONE,
} from "@/constants";
import useSearch from "@/hooks/useSearch";
import MyImage from "../image";

interface Props {
  promotion: Promotion;
  state: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function DetailPromotionModal({ promotion, state, onOpen, onClose }: Props) {
  const [selectedFilterer, setSelectedFilterer] = useState<-1 | PromotionMenuItemType>(-1);
  const [promotionMenuItems, setPromotionMenuItems] = useState<PromotionMenuItem[]>([]);
  const [filterdPromotionMenuItems, setSearchQuery] = useSearch(
    promotionMenuItems,
    (promotionMenuItems, searchQuery) =>
      promotionMenuItems.filter((promotionMenuItem) =>
        promotionMenuItem.menuItem.name.includes(searchQuery),
      ),
  );
  const [token, setToken] = useLocalStorage(LOCAL_STORAGE_EMPLOYEE_TOKEN, "");

  useEffect(() => {
    getPromotionMenuItems(token, promotion.id)
      .then((promotionMenuItems) => setPromotionMenuItems(promotionMenuItems))
      .catch((err) => console.log(err));
  }, [token, state]);

  const hourMinute = nanoSecondToHourMinute(promotion.duration);

  const filteredPromotionMenuItemsType = filterdPromotionMenuItems.filter((promotionMenuItem) =>
    selectedFilterer !== -1 ? promotionMenuItem.type === selectedFilterer : promotionMenuItem,
  );

  return (
    <Modal open={state} onClose={onClose}>
      <Box>
        <ModalStack>
          <Stack direction={"row"} spacing="12px">
            <div>
              <div
                style={{
                  maxWidth: "130px",
                  maxHeight: "130px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  height: "fit-content",
                }}
              >
                <MyImage imagePath={promotion.imagePath} />
              </div>
            </div>
            <Stack spacing={"10px"} width={"100%"}>
              <TextField label="ชื่อโปรโมชั่น" value={promotion.name} />
              <Stack direction={"row"} spacing={"10px"}>
                <TextField label="น้ำหนักสุทธิ" value={promotion.weight} />
                <TextField label="ราคาเริ่มต้น" value={promotion.price} />
              </Stack>
              <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
                <TextField
                  label="ชั่วโมง"
                  name="hours"
                  value={hourMinute.hours}
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: 99 } }}
                />
                <TextField
                  label="นาที"
                  name="minutes"
                  value={hourMinute.minutes}
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: 59 } }}
                />
              </Stack>
            </Stack>
          </Stack>
          <TextArea label="คำอธิบาย" value={promotion.description} />
          <Stack direction={"row"} spacing={"10px"}>
            <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
              <Title>แสดงเฉพาะ: </Title>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedFilterer}
                onChange={(e) => setSelectedFilterer(e.target.value as PromotionMenuItemType)}
                sx={{
                  "& fieldset": { border: "none" },
                  fontWeight: "bold",
                  backgroundColor: "#E6E6E5",
                  borderRadius: "16px",
                  maxWidth: "110px",
                  maxHeight: "32px",
                  minWidth: "110px",
                  minHeight: "32px",
                }}
              >
                <MenuItem value={-1}>
                  <Title>{SELECT_LABEL_PROMOTION_MENU_ITEM_DEFAULT}</Title>
                </MenuItem>
                <MenuItem value={PromotionMenuItemType.None}>
                  <Title>{SELECT_LABEL_PROMOTION_MENU_ITEM_NONE}</Title>
                </MenuItem>
                <MenuItem value={PromotionMenuItemType.Buffet}>
                  <Title>{SELECT_LABEL_PROMOTION_MENU_ITEM_BUFFET}</Title>
                </MenuItem>
                <MenuItem value={PromotionMenuItemType.ALaCarte}>
                  <Title>{SELECT_LABEL_PROMOTION_MENU_ITEM_ALACARTE}</Title>
                </MenuItem>
              </Select>
            </Stack>
            <Box sx={{ flexGrow: 1 }}>
              <TextField
                label="ค้นหาเมนูตามชื่อ"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Box>
          </Stack>
          <Stack
            borderRadius={"16px"}
            bgcolor={"#E6E6E5"}
            padding={"8px"}
            spacing={"10px"}
            minHeight={"330px"}
            maxHeight={"330px"}
            sx={{ overflowY: "auto" }}
          >
            {filteredPromotionMenuItemsType.map((promotionMenuItem) => (
              <Stack
                direction={"row"}
                spacing={"4px"}
                key={promotionMenuItem.menuItem.id}
                alignItems={"center"}
              >
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={promotionMenuItem.type}
                  disabled
                  onChange={(e) => {
                    let p = promotionMenuItems.find(
                      (promoItem) => promoItem.menuItem.id === promotionMenuItem.menuItem.id,
                    );
                    if (p === undefined) throw new Error();
                    p.type = e.target.value as PromotionMenuItemType;
                    setPromotionMenuItems([...promotionMenuItems]);
                  }}
                  sx={{
                    "& fieldset": { border: "none" },
                    fontWeight: "bold",
                    backgroundColor: "#FAFAFA",
                    borderRadius: "16px",
                    maxWidth: "110px",
                    maxHeight: "32px",
                    minWidth: "110px",
                    minHeight: "32px",
                  }}
                >
                  <MenuItem value={PromotionMenuItemType.None}>
                    <Title>{SELECT_LABEL_PROMOTION_MENU_ITEM_NONE}</Title>
                  </MenuItem>
                  <MenuItem value={PromotionMenuItemType.Buffet}>
                    <Title>{SELECT_LABEL_PROMOTION_MENU_ITEM_BUFFET}</Title>
                  </MenuItem>
                  <MenuItem value={PromotionMenuItemType.ALaCarte}>
                    <Title>{SELECT_LABEL_PROMOTION_MENU_ITEM_ALACARTE}</Title>
                  </MenuItem>
                </Select>
                <Title>{promotionMenuItem.menuItem.name}</Title>
              </Stack>
            ))}
          </Stack>
          <Button label="ปิด" myVariant="secondary" onClick={onClose} />
        </ModalStack>
      </Box>
    </Modal>
  );
}
