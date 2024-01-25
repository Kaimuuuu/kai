import { Box, MenuItem, Modal, Select, Stack } from "@mui/material";
import ModalStack from "../modalStack";
import TextField from "../textField";
import Title from "../typo/title";
import IOSSwitch from "../switch";
import Button from "../button";
import {
  Promotion,
  PromotionMenuItem,
  PromotionMenuItemType,
  UpdatePromotionRequest,
} from "@/types";
import { ChangeEvent, useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import TextArea from "../textArea";
import {
  deletePromotion,
  getPromotionMenuItems,
  updatePromotion,
} from "@/services/promotionService";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { nanoSecondToHourMinute, toNanoSecond } from "@/util/duration";
import {
  DEFAULT_EMPLOYEE_TOKEN,
  LOCAL_STORAGE_EMPLOYEE_TOKEN,
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
import useEmployeeToken from "@/hooks/useEmployeeToken";

interface Props {
  promotion: Promotion;
  state: boolean;
  onOpen: () => void;
  onClose: () => void;
  refreshPromotions: () => void;
}

export default function EditPromotionModal({
  promotion,
  state,
  onOpen,
  onClose,
  refreshPromotions,
}: Props) {
  const [selectedFilterer, setSelectedFilterer] = useState<-1 | PromotionMenuItemType>(-1);
  const [promotionMenuItems, setPromotionMenuItems] = useState<PromotionMenuItem[]>([]);
  const [filterdPromotionMenuItems, setSearchQuery] = useSearch(
    promotionMenuItems,
    (promotionMenuItems, searchQuery) =>
      promotionMenuItems.filter((promotionMenuItem) =>
        promotionMenuItem.menuItem.name.includes(searchQuery),
      ),
  );
  const token = useEmployeeToken();
  const [noLimitTime, setNoLimitTime] = useState<boolean>(false);
  const [imageFile, setImageFile, previewUrl] = usePreviewImage();

  const MAX_HOURS = 99;
  const MAX_MINUTES = 59;

  useEffect(() => {
    if (token) {
      getPromotionMenuItems(token, promotion.id)
        .then((promotionMenuItems) => {
          setPromotionMenuItems(promotionMenuItems);
        })
        .catch((err) => console.log(err));
    }
  }, [token, state]);

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

  const HoursMinutes = nanoSecondToHourMinute(promotion.duration);

  const formik = useFormik({
    initialValues: {
      name: promotion.name,
      weight: promotion.weight,
      price: promotion.price,
      hours: HoursMinutes.hours,
      minutes: HoursMinutes.minutes,
      description: promotion.description,
    },
    onSubmit: async (values) => {
      onClose();
      let imagePath = promotion.imagePath;
      if (imageFile) {
        imagePath = await uploadImage(token, imageFile);
      }

      const req: UpdatePromotionRequest = {
        name: values.name,
        weight: values.weight,
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
      updatePromotion(token, req, promotion.id)
        .then(() => {
          formik.resetForm();
          refreshPromotions();
          Swal.fire({
            title: "แก้ไขโปรโมชั่นสำเร็จ",
            icon: "success",
            confirmButtonText: "ตกลง",
          });
        })
        .catch((err: Error) => {
          Swal.fire({
            title: "แก้ไขโมชั่นไม่สำเร็จ",
            text: err.message,
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        });
    },
  });

  const onDelete = () => {
    onClose();
    Swal.fire({
      title: `ต้องการที่จะลบโปรโมชั่น "${promotion.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        deletePromotion(token, promotion.id)
          .then(() => {
            refreshPromotions();
            Swal.fire({
              title: "ลบโปรโมชั่นสำเร็จ",
              icon: "success",
              confirmButtonText: "ตกลง",
            });
          })
          .catch((err: Error) => {
            Swal.fire({
              title: "ลบโปรโมชั่นไม่สำเร็จ",
              text: err.message,
              icon: "error",
              confirmButtonText: "ตกลง",
            });
          });
      }
    });
  };

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
                <MyImage
                  imagePath={!imageFile ? promotion.imagePath : previewUrl}
                  frontend={imageFile !== undefined}
                />
              </div>
              <Body>**คลิกที่รูปเพื่อเลือกรูปภาพ**</Body>
            </div>
            <Stack spacing={"10px"} width={"100%"}>
              <TextField
                label="ชื่อโปรโมชั่น"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                required
              />
              <Stack direction={"row"} spacing={"10px"}>
                <TextField
                  label="น้ำหนักสุทธิ"
                  name="weight"
                  onChange={formik.handleChange}
                  value={formik.values.weight}
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  required
                />
                <TextField
                  label="ราคาเริ่มต้น"
                  name="price"
                  onChange={formik.handleChange}
                  value={formik.values.price}
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
          <TextArea
            label="คำอธิบาย"
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
          />
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
          <Button label="แก้ไขโปรโมชั่น" myVariant="primary" type="submit" />
          <Button label="ปิด" myVariant="secondary" onClick={onClose} />
          <Button label="ลบโปรโมชั่น" myVariant="danger" onClick={onDelete} />
        </ModalStack>
      </form>
    </Modal>
  );
}
