import { Box, MenuItem, Modal, Select, Stack } from "@mui/material";
import ModalStack from "../modalStack";
import TextField from "../textField";
import Title from "../typo/title";
import IOSSwitch from "../switch";
import Button from "../button";
import { CreatePromotionRequest, PromotionMenuItem, PromotionMenuItemType } from "@/types";
import { ChangeEvent, useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import TextArea from "../textArea";
import { createPromotion, getAllPromotionMenuItems } from "@/services/promotionService";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { toNanoSecond } from "@/util/duration";
import {
  LOCAL_STORAGE_EMPLOYEE_TOKEN,
  LOCAL_STORAGE_ROLE,
  SELECT_LABEL_PROMOTION_MENU_ITEM_ALACARTE,
  SELECT_LABEL_PROMOTION_MENU_ITEM_BUFFET,
  SELECT_LABEL_PROMOTION_MENU_ITEM_DEFAULT,
  SELECT_LABEL_PROMOTION_MENU_ITEM_NONE,
} from "@/constants";
import useSearch from "@/hooks/useSearch";
import usePreviewImage from "@/hooks/usePreviewImage";
import { uploadImage } from "@/services/imageService";
import MyImage from "../image";
import Body from "../typo/body";

interface Props {
  state: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function NewPromotionModal({ state, onOpen, onClose }: Props) {
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
  const [noLimitTime, setNoLimitTime] = useState<boolean>(false);
  const [imageFile, setImageFile, previewUrl] = usePreviewImage();

  const MAX_HOURS = 99;
  const MAX_MINUTES = 59;

  useEffect(() => {
    getAllPromotionMenuItems(token)
      .then((promotionMenuItems) => {
        setPromotionMenuItems(promotionMenuItems);
      })
      .catch((err) => console.log(err));
  }, [token]);

  const filteredPromotionMenuItemsType = filterdPromotionMenuItems.filter((promotionMenuItem) =>
    selectedFilterer !== -1 ? promotionMenuItem.type === selectedFilterer : promotionMenuItem,
  );

  const onBrowseImage = () => {
    document.getElementById("image")?.click();
  };

  const onChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      weight: "",
      price: "",
      hours: "",
      minutes: "",
      description: "",
    },
    onSubmit: async (values) => {
      let imagePath = "";
      if (imageFile) {
        imagePath = await uploadImage(token, imageFile);
      }

      const req: CreatePromotionRequest = {
        name: values.name,
        weight: Number(values.weight),
        price: Number(values.price),
        imagePath: imagePath,
        duration: Number(
          noLimitTime
            ? toNanoSecond(MAX_HOURS, MAX_MINUTES)
            : toNanoSecond(Number(values.hours), Number(values.minutes)),
        ),
        description: values.description,
        promotionMenuItems: promotionMenuItems
          .filter((promotionMenuItem) => promotionMenuItem.type !== PromotionMenuItemType.None)
          .map((promotionMenuItem) => ({
            type: promotionMenuItem.type,
            menuItemId: promotionMenuItem.menuItem.id,
          })),
      };
      createPromotion(token, req)
        .then(() => {
          onClose();
          Swal.fire({
            title: "สร้างโปรโมชั่นสำเร็จ",
            icon: "success",
            confirmButtonText: "ตกลง",
          });
        })
        .catch((err) => console.log(err));
    },
  });

  return (
    <Modal open={state} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <ModalStack>
          <Stack direction={"row"} spacing="12px">
            <div>
              <input type="file" id="image" style={{ display: "none" }} onChange={onChangeImage} />
              <div
                style={{
                  maxWidth: "130px",
                  maxHeight: "130px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  height: "fit-content",
                }}
                onClick={onBrowseImage}
              >
                <MyImage imagePath={previewUrl} frontend />
              </div>
              <Body>**คลิกที่รูปเพื่อเลือกรูปภาพ**</Body>
            </div>
            <Stack spacing={"10px"} width={"100%"}>
              <TextField
                label="ชื่อโปรโมชั่น"
                name="name"
                onChange={formik.handleChange}
                required
              />
              <Stack direction={"row"} spacing={"10px"}>
                <TextField
                  label="น้ำหนักสุทธิ"
                  name="weight"
                  onChange={formik.handleChange}
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  required
                />
                <TextField
                  label="ราคาเริ่มต้น"
                  name="price"
                  onChange={formik.handleChange}
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  required
                />
              </Stack>
              <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
                <Title>ไม่จำกัดเวลา: </Title>
                <IOSSwitch checked={noLimitTime} onClick={() => setNoLimitTime(!noLimitTime)} />
              </Stack>
              <Stack direction={"row"} alignItems={"center"} spacing={"4px"}>
                <TextField
                  label="ชั่วโมง"
                  name="hours"
                  onChange={formik.handleChange}
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: MAX_HOURS } }}
                  value={noLimitTime ? MAX_HOURS : formik.values.hours}
                  required
                />
                <TextField
                  label="นาที"
                  name="minutes"
                  onChange={formik.handleChange}
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: MAX_MINUTES } }}
                  value={noLimitTime ? MAX_MINUTES : formik.values.minutes}
                  required
                />
              </Stack>
            </Stack>
          </Stack>
          <TextArea label="คำอธิบาย" name="description" onChange={formik.handleChange} />
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
          <Button label="สร้างโปรโมชั่น" myVariant="primary" type="submit" />
          <Button label="ปิด" myVariant="secondary" onClick={onClose} />
        </ModalStack>
      </form>
    </Modal>
  );
}
