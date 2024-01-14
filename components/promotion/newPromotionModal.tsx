import { Box, MenuItem, Modal, Select, Stack } from "@mui/material";
import ModalStack from "../modalStack";
import Image from "next/image";
import TextField from "../textField";
import Title from "../typo/title";
import IOSSwitch from "../switch";
import Button from "../button";
import { CreatePromotionRequest, PromotionMenuItem, PromotionMenuItemType } from "@/types";
import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import TextArea from "../textArea";
import { createPromotion } from "@/services/promotionService";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { getEditMenu } from "@/services/menuService";
import { toNanoSecond } from "@/util/duration";
import { LOCAL_STORAGE_EMPLOYEE_TOKEN } from "@/constants";

interface Props {
  state: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function NewPromotionModal({ state, onOpen, onClose }: Props) {
  const [selectedFilterer, setSelectedFilterer] = useState<-1 | PromotionMenuItemType>(-1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [promotionMenuItems, setPromotionMenuItems] = useState<PromotionMenuItem[]>([]);
  const [token, setToken] = useLocalStorage(LOCAL_STORAGE_EMPLOYEE_TOKEN, "");
  const [noLimitTime, setNoLimitTime] = useState<boolean>(false);

  const MAX_DURATION = toNanoSecond(99, 59);

  useEffect(() => {
    getEditMenu(token)
      .then((menus) => {
        const menuItems = menus.flatMap((menu) => menu.items);
        setPromotionMenuItems(
          menuItems.map((menuItem) => ({
            type: PromotionMenuItemType.None,
            menuItem: menuItem,
          })),
        );
      })
      .catch((err) => console.log(err));
  }, [token]);

  const filteredPromotionMenuItemsType = promotionMenuItems.filter((promotionMenuItem) =>
    selectedFilterer !== -1 ? promotionMenuItem.type === selectedFilterer : promotionMenuItem,
  );
  const filterdPromotionMenuItems = filteredPromotionMenuItemsType.filter((promotionMenuItem) =>
    promotionMenuItem.menuItem.name.includes(searchQuery),
  );

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
      const req: CreatePromotionRequest = {
        name: values.name,
        weight: Number(values.weight),
        price: Number(values.price),
        imagePath: "5280299_8rBqOCmjF75De_ZfwL1cBkjm30ZsF7Y542g7jhDhTIQ.jpg",
        duration: Number(
          noLimitTime ? MAX_DURATION : toNanoSecond(Number(values.hours), Number(values.minutes)),
        ),
        description: values.description,
        promotionMenuItems: promotionMenuItems.map((promotionMenuItem) => ({
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
              <div
                style={{
                  maxWidth: "130px",
                  maxHeight: "130px",
                  borderRadius: "16px",
                  overflow: "hidden",
                  height: "fit-content",
                }}
              >
                <Image
                  src="https://miro.medium.com/v2/resize:fit:1140/1*MxljsIAuPTci8V2Zdyjywg.jpeg"
                  alt="Next.js Logo"
                  width={130}
                  height={130}
                  priority
                />
              </div>
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
                  disabled={noLimitTime}
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: 99 } }}
                  required
                />
                <TextField
                  label="นาที"
                  name="minutes"
                  onChange={formik.handleChange}
                  disabled={noLimitTime}
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: 59 } }}
                  required
                />
              </Stack>
            </Stack>
          </Stack>
          <TextArea label="คำอธิบาย" name="description" onChange={formik.handleChange} required />
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
                  <Title>-</Title>
                </MenuItem>
                <MenuItem value={PromotionMenuItemType.None}>
                  <Title>ไม่แสดง</Title>
                </MenuItem>
                <MenuItem value={PromotionMenuItemType.Buffet}>
                  <Title>Buffet</Title>
                </MenuItem>
                <MenuItem value={PromotionMenuItemType.ALaCarte}>
                  <Title>A La Carte</Title>
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
            {filterdPromotionMenuItems.map((promotionMenuItem) => (
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
                    <Title>ไม่แสดง</Title>
                  </MenuItem>
                  <MenuItem value={PromotionMenuItemType.Buffet}>
                    <Title>Buffet</Title>
                  </MenuItem>
                  <MenuItem value={PromotionMenuItemType.ALaCarte}>
                    <Title>A La Carte</Title>
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
