import { Stack } from "@mui/material";
import Card from "@mui/material/Card";
import SubHeading from "../typo/subHeading";
import Body from "../typo/body";
import { MenuItem } from "@/types";
import IOSSwitch from "../switch";
import Swal from "sweetalert2";
import { useState } from "react";
import { toggleOutOfStock } from "@/services/menuService";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_EMPLOYEE_TOKEN } from "@/constants";
import MyImage from "../image";
import Button from "../button";
import EditMenuModal from "./editMenuModal";

interface Props {
  menuItem: MenuItem;
  refreshEditMenus: () => void;
}

export default function EditMenuCard({ menuItem, refreshEditMenus }: Props) {
  const [isOutOfStock, setIsOutOfStock] = useState<boolean>(menuItem.outOfStock);
  const [token, setToken] = useLocalStorage(LOCAL_STORAGE_EMPLOYEE_TOKEN, "");
  const [editMenuModal, setEditMenuModal] = useState<boolean>(false);

  const onOpenEditMenuModal = () => setEditMenuModal(true);
  const onCloseEditMenuModal = () => setEditMenuModal(false);

  const onSwitchOutOfStock = () => {
    Swal.fire({
      title: `ต้องการเปลี่ยนสถาณะเมนู "${menuItem.name}" เป็น ${isOutOfStock ? `"ไม่หมด"` : `"หมด"`}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        toggleOutOfStock(token, menuItem.id, !isOutOfStock)
          .then(() => {
            Swal.fire({
              title: `เปลี่ยนสถาณะเมนู "${menuItem.name}" เป็น ${isOutOfStock ? `"ไม่หมด"` : `"หมด"`} สำเร็จ`,
              icon: "success",
              confirmButtonText: "ตกลง",
            });
          })
          .catch((err) => {
            Swal.fire({
              title: `เปลี่ยนสถาณะเมนู "${menuItem.name}" เป็น ${isOutOfStock ? `"ไม่หมด"` : `"หมด"`} ล้มเหลว`,
              icon: "error",
              confirmButtonText: "ตกลง",
            });
          });
        setIsOutOfStock(!isOutOfStock);
      }
    });
  };

  return (
    <Card sx={{ borderRadius: "16px", width: "100%" }}>
      <Stack sx={{ padding: "12px" }} spacing="12px">
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
              <MyImage imagePath={menuItem.imagePath} />
            </div>
          </div>
          <Stack sx={{ width: "100%" }}>
            <SubHeading>{menuItem.name}</SubHeading>
            <Body>{`น้ำหนัก: ${menuItem.weight}`}</Body>
            <Body>{menuItem.description}</Body>
            <Stack direction={"row"} alignItems={"center"} sx={{ marginTop: "auto" }}>
              <Body bold>{`ราคา: ${menuItem.price}฿`}</Body>
              <Stack
                alignItems={"center"}
                direction={"row"}
                sx={{ marginLeft: "auto" }}
                spacing={0.2}
              >
                <Body bold>{`หมด: `}</Body>
                <IOSSwitch checked={isOutOfStock} onClick={onSwitchOutOfStock} />
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        {menuItem.editable && <Button label="แก้ไข" onClick={onOpenEditMenuModal} />}
        {menuItem.editable && (
          <EditMenuModal
            menuItem={menuItem}
            onOpen={onOpenEditMenuModal}
            onClose={onCloseEditMenuModal}
            state={editMenuModal}
            refreshEditMenus={refreshEditMenus}
          />
        )}
      </Stack>
    </Card>
  );
}
