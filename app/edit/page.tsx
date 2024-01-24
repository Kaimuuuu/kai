"use client";

import TextField from "@/components/textField";
import EditMenuCard from "@/components/menu/editMenuCard";
import Navbar from "@/components/layout/navbar";
import Heading from "@/components/typo/heading";
import { getEditMenu } from "@/services/menuService";
import { EmployeeRole, Menu } from "@/types";
import { Box, Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import useSearch from "@/hooks/useSearch";
import Button from "@/components/button";
import NewMenuModal from "@/components/menu/newMenuModal";
import useEmployeeToken from "@/hooks/useEmployeeToken";
import useRole from "@/hooks/useRole";

export default function EditMenu() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [filterdMenus, setSearchQuery] = useSearch(menus, (menus, searchQuery) =>
    menus.map((menu) => ({
      catagory: menu.catagory,
      items: menu.items.filter((item) => item.name.includes(searchQuery)),
    })),
  );
  const token = useEmployeeToken();
  const role = useRole();
  const [newMenuModal, setNewMenuModal] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    getEditMenu(token, role)
      .then((menus) => {
        setMenus(menus);
      })
      .catch((err) => console.log(err));
  }, [token, refresh]);

  const onOpenNewMenuModal = () => setNewMenuModal(true);
  const onCloseNewMenuModal = () => setNewMenuModal(false);

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
              <Box width={"30%"}>
                <Button label="เพิ่มเมนู" onClick={onOpenNewMenuModal} />
              </Box>
            )}
            <TextField label="ค้นหาเมนูตามชื่อ" onChange={(e) => setSearchQuery(e.target.value)} />
          </Stack>
          <Stack spacing={2} width={"100%"}>
            {filterdMenus.map((menu) => (
              <Stack spacing={1} key={menu.catagory}>
                <Heading>{menu.catagory}</Heading>
                {menu.items.map((menuItem) => (
                  <EditMenuCard
                    key={menuItem.id}
                    menuItem={menuItem}
                    refreshEditMenus={refreshing}
                  />
                ))}
              </Stack>
            ))}
          </Stack>
        </Stack>
        <NewMenuModal
          state={newMenuModal}
          onClose={onCloseNewMenuModal}
          onOpen={onOpenNewMenuModal}
          refreshEditMenus={refreshing}
        />
      </Container>
    </main>
  );
}
