"use client";

import TextField from "@/components/textField";
import EditMenuCard from "@/components/menu/editMenuCard";
import Navbar from "@/components/layout/navbar";
import Heading from "@/components/typo/heading";
import { Employee, EmployeeRole, Menu } from "@/types";
import { Box, Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import useSearch from "@/hooks/useSearch";
import { LOCAL_STORAGE_EMPLOYEE_TOKEN, LOCAL_STORAGE_ROLE } from "@/constants";
import Button from "@/components/button";
import { getEmployees } from "@/services/employeeService";
import EmployeeCard from "@/components/employee/employeeCard";
import NewEmployeeModal from "@/components/employee/newEmployeeModal";

export default function EditMenu() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filterdEmployees, setSearchQuery] = useSearch(employees, (employees, searchQuery) =>
    employees.filter((employee) => employee.name.includes(searchQuery)),
  );
  const [token, setToken] = useLocalStorage(LOCAL_STORAGE_EMPLOYEE_TOKEN, "");
  const [role, setRole] = useLocalStorage(LOCAL_STORAGE_ROLE, "-1");
  const [newEmployeeModal, setNewEmployeeModal] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    getEmployees(token, Number(role))
      .then((menus) => {
        setEmployees(menus);
      })
      .catch((err) => console.log(err));
  }, [token, refresh]);

  const onOpenNewEmployeeModal = () => setNewEmployeeModal(true);
  const onCloseNewEmployeeModal = () => setNewEmployeeModal(false);

  const refreshing = () => setRefresh(!refresh);

  return (
    <main
      style={{
        backgroundColor: "#FAFAFA",
        paddingTop: "20px",
        paddingBottom: "20px",
        minHeight: "100vh",
      }}
    >
      <Container>
        <Navbar />
        <Stack alignItems={"center"} spacing={"10px"}>
          <Stack direction={"row"} width={"100%"} spacing={"10px"}>
            {Number(role) === EmployeeRole.Admin && (
              <Box width={"40%"}>
                <Button label="เพิ่มพนักงาน" onClick={onOpenNewEmployeeModal} />
              </Box>
            )}
            <TextField
              label="ค้นหาพนักงานด้วยชื่อ"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Stack>
          <Stack spacing={2} width={"100%"}>
            {filterdEmployees.map((employee) => (
              <EmployeeCard employee={employee} key={employee.id} refreshEmployees={refreshing} />
            ))}
          </Stack>
        </Stack>
        <NewEmployeeModal
          state={newEmployeeModal}
          onClose={onCloseNewEmployeeModal}
          onOpen={onOpenNewEmployeeModal}
          refreshEmployees={refreshing}
        />
      </Container>
    </main>
  );
}
