import { Modal, Stack } from "@mui/material";
import ModalStack from "../modalStack";
import TextArea from "../textArea";
import Button from "../button";
import TextField from "../textField";
import { ChangeEvent } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { CreateMenuRequest } from "@/types";
import { createMenu } from "@/services/menuService";
import { uploadImage } from "@/services/imageService";
import usePreviewImage from "@/hooks/usePreviewImage";
import MyImage from "../image";
import Body from "../typo/body";
import useEmployeeToken from "@/hooks/useEmployeeToken";

interface Props {
  state: boolean;
  onClose: () => void;
  onOpen: () => void;
  refreshEditMenus: () => void;
}

export default function NewMenuModal({ state, onClose, onOpen, refreshEditMenus }: Props) {
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

  const formik = useFormik({
    initialValues: {
      name: "",
      catagory: "",
      description: "",
      price: "",
    },
    onSubmit: async (values) => {
      onClose();
      let imagePath = "";
      if (imageFile) {
        imagePath = await uploadImage(token, imageFile);
      }

      const req: CreateMenuRequest = {
        name: values.name,
        catagory: values.catagory,
        description: values.description,
        price: Number(values.price),
        imagePath: imagePath,
        outOfStock: false,
      };
      createMenu(token, req)
        .then(() => {
          formik.resetForm();
          refreshEditMenus();
          Swal.fire({
            title: "สร้างเมนูสำเร็จ",
            icon: "success",
            confirmButtonText: "ตกลง",
          });
        })
        .catch((err: Error) => {
          Swal.fire({
            title: "สร้างเมนูล้มเหลว",
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
                <MyImage imagePath={previewUrl} frontend />
              </div>
              <Body>**คลิกที่รูปเพื่อเลือกรูปภาพ**</Body>
            </div>
            <Stack spacing={"10px"} width={"100%"}>
              <TextField
                label="ชื่อรายการอาหาร"
                name="name"
                onChange={formik.handleChange}
                required
              />
              <Stack direction={"row"} spacing={"10px"}>
                <TextField
                  label="หมวดหมู่"
                  name="catagory"
                  onChange={formik.handleChange}
                  required
                />
                <TextField
                  label="ราคา"
                  name="price"
                  onChange={formik.handleChange}
                  required
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Stack>
              <TextArea label="คำอธิบาย" name="description" onChange={formik.handleChange} />
            </Stack>
          </Stack>
          <Button label="เพิ่มเมนูอาหาร" type="submit" />
          <Button label="ยกเลิก" myVariant="secondary" onClick={onClose} />
        </ModalStack>
      </form>
    </Modal>
  );
}
