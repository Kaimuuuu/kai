"use client";

import TextField from "@/components/textField";
import Navbar from "@/components/layout/navbar";
import { Employee, EmployeeRole, Menu } from "@/types";
import { Box, Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import useSearch from "@/hooks/useSearch";
import Button from "@/components/button";
import { getEmployees } from "@/services/employeeService";
import EmployeeCard from "@/components/employee/employeeCard";
import NewEmployeeModal from "@/components/employee/newEmployeeModal";
import useEmployeeToken from "@/hooks/useEmployeeToken";
import useRole from "@/hooks/useRole";
import Loading from "@/components/loading";
import { useRouter } from "next/navigation";
import { me } from "@/services/authService";

export default function EditMenu() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filterdEmployees, setSearchQuery] = useSearch(employees, (employees, searchQuery) =>
    employees.filter((employee) => employee.name.includes(searchQuery)),
  );
  const token = useEmployeeToken();
  const role = useRole();
  const [newEmployeeModal, setNewEmployeeModal] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    if (token && isLoading) {
      me(token).catch((err) => {
        router.push("/login");
      });
    }
  }, [token, isLoading]);

  useEffect(() => {
    if (token) {
      getEmployees(token, role)
        .then((menus) => {
          setEmployees(menus);
          setIsLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [token, refresh]);

  const onOpenNewEmployeeModal = () => setNewEmployeeModal(true);
  const onCloseNewEmployeeModal = () => setNewEmployeeModal(false);

  const refreshing = () => setRefresh(!refresh);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main
      style={{
        paddingTop: "20px",
        paddingBottom: "20px",
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
