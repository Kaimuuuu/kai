import { MenuItem, Modal, Select, Stack } from "@mui/material";
import ModalStack from "../modalStack";
import Button from "../button";
import TextField from "../textField";
import { ChangeEvent, useState } from "react";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { Employee, EmployeeRoleName, UpdateEmployeeRequest } from "@/types";
import useLocalStorage from "@/hooks/useLocalStorage";
import { EMPLOYEE_ROLE_NAME_ADMIN, EMPLOYEE_ROLE_NAME_CHEF, EMPLOYEE_ROLE_NAME_WAITER, LOCAL_STORAGE_EMPLOYEE_TOKEN } from "@/constants";
import { uploadImage } from "@/services/imageService";
import usePreviewImage from "@/hooks/usePreviewImage";
import MyImage from "../image";
import Body from "../typo/body";
import { employeeRoleNameToEmployeeRole, employeeRoleToEmployeeRoleName } from "@/util/role";
import { deleteEmployee, updateEmployee } from "@/services/employeeService";
import Title from "../typo/title";

interface Props {
  employee: Employee;
  state: boolean;
  onClose: () => void;
  onOpen: () => void;
  refreshEmployees: () => void;
}

export default function EditEmployeeModal({ employee, state, onClose, onOpen, refreshEmployees }: Props) {
  const [imageFile, setImageFile, previewUrl] = usePreviewImage();
  const [selectedRole, setSelectedRole] = useState<string>(employeeRoleToEmployeeRoleName(employee.role));
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
      name: employee.name,
      age: employee.age,
      email: employee.email,
    },
    onSubmit: async (values) => {
      let imagePath = employee.imagePath;
      if (imageFile) {
        imagePath = await uploadImage(token, imageFile);
      }

      const req: UpdateEmployeeRequest = {
        name: values.name,
        age: Number(values.age),
        role: employeeRoleNameToEmployeeRole(selectedRole as EmployeeRoleName),
        email: values.email,
        imagePath: imagePath,
      };
      console.log(req)
      updateEmployee(token, req, employee.id)
        .then(() => {
          onClose();
          refreshEmployees();
          Swal.fire({
            title: "แก้ไขข้อมูลพนักงานสำเร็จ",
            icon: "success",
            confirmButtonText: "ตกลง",
          });
        })
        .catch((err) => {
          Swal.fire({
            title: "แก้ไขข้อมูลพนักงานล้มเหลว",
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        });
    },
  });

  const onDelete = () => {
    onClose();
    Swal.fire({
      title: `ต้องการที่จะลบพนักงาน "${employee.name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEmployee(token, employee.id)
          .then(() => {
            refreshEmployees();
            Swal.fire({
              title: "ลบพนักงานสำเร็จ",
              icon: "success",
              confirmButtonText: "ตกลง",
            });
          })
          .catch((err) => {
            Swal.fire({
              title: "ลบพนักงานล้มเหลว",
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
                  imagePath={!imageFile ? employee.imagePath : previewUrl}
                  frontend={imageFile !== undefined}
                />
              </div>
              <Body>**คลิกที่รูปเพื่อเลือกรูปภาพ**</Body>
            </div>
            <Stack spacing={"10px"} width={"100%"}>
              <TextField
                label="ชื่อพนักงาน"
                name="name"
                onChange={formik.handleChange}
                value={formik.values.name}
                required
              />
              <Stack direction={"row"} spacing={"10px"}>
                <TextField
                  label="อายุ"
                  name="age"
                  onChange={formik.handleChange}
                  value={formik.values.age}
                  required
                />
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
                value={formik.values.email}
                required
                type="email"
              />
            </Stack>
          </Stack>
          <Button label="แก้ไขข้อมูลพนักงาน" type="submit" />
          <Button label="ยกเลิก" myVariant="secondary" onClick={onClose} />
          <Button label="ลบพนักงาน" myVariant="danger" onClick={onDelete} />
        </ModalStack>
      </form>
    </Modal>
  );
}
