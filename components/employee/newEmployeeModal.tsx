import { MenuItem, Modal, Select, Stack } from "@mui/material";
import ModalStack from "../modalStack";
import Button from "../button";
import TextField from "../textField";
import { ChangeEvent, useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { CreateEmployeeRequest, EmployeeRoleName } from "@/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import {
  EMPLOYEE_ROLE_NAME_ADMIN,
  EMPLOYEE_ROLE_NAME_CHEF,
  EMPLOYEE_ROLE_NAME_WAITER,
  LOCAL_STORAGE_EMPLOYEE_TOKEN,
} from "@/constants";
import { uploadImage } from "@/services/imageService";
import usePreviewImage from "@/hooks/usePreviewImage";
import MyImage from "../image";
import Body from "../typo/body";
import { employeeRoleNameToEmployeeRole } from "@/util/role";
import { createEmployee } from "@/services/employeeService";
import Title from "../typo/title";

interface Props {
  state: boolean;
  onClose: () => void;
  onOpen: () => void;
  refreshEmployees: () => void;
}

export default function NewEmployeeModal({ state, onClose, onOpen, refreshEmployees }: Props) {
  const [imageFile, setImageFile, previewUrl] = usePreviewImage();
  const [selectedRole, setSelectedRole] = useState<string>(EMPLOYEE_ROLE_NAME_WAITER);
  const [token, setToken] = useLocalStorage(LOCAL_STORAGE_EMPLOYEE_TOKEN, "");

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
      age: "",
      email: "",
    },
    onSubmit: async (values) => {
      onClose();
      let imagePath = "";
      if (imageFile) {
        imagePath = await uploadImage(token, imageFile);
      }

      const req: CreateEmployeeRequest = {
        name: values.name,
        age: Number(values.age),
        role: employeeRoleNameToEmployeeRole(selectedRole as EmployeeRoleName),
        email: values.email,
        imagePath: imagePath,
      };
      createEmployee(token, req)
        .then((generatedPassword: string) => {
          refreshEmployees();
          Swal.fire({
            title: "เพิ่มพนักงานสำเร็จ",
            text: `รหัสผ่าน: ${generatedPassword}`,
            icon: "success",
            confirmButtonText: "ตกลง",
          });
        })
        .catch((err: Error) => {
          Swal.fire({
            title: "เพิ่มพนักงานล้มเหลว",
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
              <TextField label="ชื่อพนักงาน" name="name" onChange={formik.handleChange} required />
              <Stack direction={"row"} spacing={"10px"}>
                <TextField label="อายุ" name="age" onChange={formik.handleChange} required />
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  onChange={(e) => setSelectedRole(e.target.value as EmployeeRoleName)}
                  value={selectedRole}
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
                  <MenuItem value={EMPLOYEE_ROLE_NAME_ADMIN}>
                    <Title>{EMPLOYEE_ROLE_NAME_ADMIN}</Title>
                  </MenuItem>
                  <MenuItem value={EMPLOYEE_ROLE_NAME_CHEF}>
                    <Title>{EMPLOYEE_ROLE_NAME_CHEF}</Title>
                  </MenuItem>
                  <MenuItem value={EMPLOYEE_ROLE_NAME_WAITER}>
                    <Title>{EMPLOYEE_ROLE_NAME_WAITER}</Title>
                  </MenuItem>
                </Select>
              </Stack>
              <TextField
                label="email"
                name="email"
                onChange={formik.handleChange}
                required
                type="email"
              />
            </Stack>
          </Stack>
          <Button label="เพิ่มพนักงาน" type="submit" />
          <Button label="ยกเลิก" myVariant="secondary" onClick={onClose} />
        </ModalStack>
      </form>
    </Modal>
  );
}
