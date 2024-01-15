import { Stack, Card as MuiCard } from "@mui/material";
import Button from "../button";
import SubHeading from "../typo/subHeading";
import Body from "../typo/body";
import MyImage from "../image";
import { Employee } from "@/types";
import { employeeRoleToEmployeeRoleName } from "@/util/role";
import { useState } from "react";
import EditEmployeeModal from "./editEmployeeModal";

interface Props {
  employee: Employee;
  refreshEmployees: () => void;
}

export default function EmployeeCard({ employee, refreshEmployees }: Props) {
  const [editEmployeeModal, setEditEmployeeModal] = useState<boolean>(false);

  const onOpenEditEmployeeModal = () => setEditEmployeeModal(true);
  const onCloseEditEmployeeModal = () => setEditEmployeeModal(false);

  return (
    <MuiCard
      sx={{
        borderRadius: "16px",
        width: "100%",
      }}
    >
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
              <MyImage imagePath={employee.imagePath} />
            </div>
          </div>
          <Stack sx={{ width: "100%" }}>
            <SubHeading>{employee.name}</SubHeading>
            <Body>{`อายุ: ${employee.age} ปี`}</Body>
            <Body>{`ตำแหน่ง: ${employeeRoleToEmployeeRoleName(employee.role)}`}</Body>
            <Body>{`email: ${employee.email}`}</Body>
            <Body>{`เป็นพนักงานเมื่อ: ${employee.createdAt}`}</Body>
          </Stack>
        </Stack>
        {employee.editable && <Button label="แก้ไข" onClick={onOpenEditEmployeeModal} />}
        {employee.editable && (
          <EditEmployeeModal
            state={editEmployeeModal}
            onClose={onCloseEditEmployeeModal}
            onOpen={onOpenEditEmployeeModal}
            employee={employee}
            refreshEmployees={refreshEmployees}
          />
        )}
      </Stack>
    </MuiCard>
  );
}
