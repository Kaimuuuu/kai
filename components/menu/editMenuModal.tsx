import { Modal, Stack } from "@mui/material";
import ModalStack from "../modalStack";
import TextArea from "../textArea";
import Button from "../button";
import TextField from "../textField";
import { ChangeEvent } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { MenuItem, UpdateMenuRequest } from "@/types";
import { deleteMenu, updateMenu } from "@/services/menuService";
import { uploadImage } from "@/services/imageService";
import usePreviewImage from "@/hooks/usePreviewImage";
import MyImage from "../image";
import Body from "../typo/body";
import useEmployeeToken from "@/hooks/useEmployeeToken";

interface Props {
  menuItem: MenuItem;
  state: boolean;
  onClose: () => void;
  onOpen: () => void;
  refreshEditMenus: () => void;
}

export default function EditMenuModal({
  menuItem,
  state,
  onClose,
  onOpen,
  refreshEditMenus,
}: Props) {
  const [imageFile, setImageFile, previewUrl] = usePreviewImage();
  const token = useEmployeeToken();

  const onBrowseImage = () => {
    document.getElementById("image")?.click();
  };

  const onChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFile(e.target.files[0]);
    }
  };

  const onDelete = () => {
    onClose();
    Swal.fire({
      title: `ต้องการที่จะลบเมนูอาหาร "${menuItem.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMenu(token, menuItem.id)
          .then(() => {
            formik.resetForm();
            refreshEditMenus();
            Swal.fire({
              title: "ลบเมนูสำเร็จ",
              icon: "success",
              confirmButtonText: "ตกลง",
            });
          })
          .catch((err: Error) => {
            Swal.fire({
              title: "ลบเมนูล้มเหลว",
              text: err.message,
              icon: "error",
              confirmButtonText: "ตกลง",
            });
          });
      }
    });
  };

  const formik = useFormik({
    initialValues: {
      name: menuItem.name,
      catagory: menuItem.catagory,
      description: menuItem.description,
      price: menuItem.price,
    },
    onSubmit: async (values) => {
      onClose();
      let imagePath = menuItem.imagePath;
      if (imageFile) {
        imagePath = await uploadImage(token, imageFile);
      }

      const req: UpdateMenuRequest = {
        name: values.name,
        catagory: values.catagory,
        description: values.description,
        price: Number(values.price),
        imagePath: imagePath,
      };
      updateMenu(token, req, menuItem.id)
        .then(() => {
          formik.resetForm();
          refreshEditMenus();
          Swal.fire({
            title: "แก้ไขเมนูสำเร็จ",
            icon: "success",
            confirmButtonText: "ตกลง",
          });
        })
        .catch((err: Error) => {
          Swal.fire({
            title: "แก้ไขเมนูล้มเหลว",
            text: err.message,
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        });
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
                <MyImage
                  imagePath={!imageFile ? menuItem.imagePath : previewUrl}
                  frontend={imageFile !== undefined}
                />
              </div>
              <Body>**คลิกที่รูปเพื่อเลือกรูปภาพ**</Body>
            </div>
            <Stack spacing={"10px"} width={"100%"}>
              <TextField
                label="ชื่อรายการอาหาร"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                required
              />
              <Stack direction={"row"} spacing={"10px"}>
                <TextField
                  label="หมวดหมู่"
                  name="catagory"
                  onChange={formik.handleChange}
                  value={formik.values.catagory}
                  required
                />
                <TextField
                  label="ราคา"
                  name="price"
                  onChange={formik.handleChange}
                  value={formik.values.price}
                  required
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Stack>
              <TextArea
                label="คำอธิบาย"
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
              />
            </Stack>
          </Stack>
          <Button label="แก้ไขเมนูอาหาร" type="submit" />
          <Button label="ยกเลิก" myVariant="secondary" onClick={onClose} />
          <Button label="ลบเมนูอาหาร" myVariant="danger" onClick={onDelete} />
        </ModalStack>
      </form>
    </Modal>
  );
}
