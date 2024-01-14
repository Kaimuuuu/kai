"use client";

import TextField from "@/components/textField";
import EditMenuCard from "@/components/menu/editMenuCard";
import Navbar from "@/components/layout/navbar";
import Heading from "@/components/typo/heading";
import { getEditMenu } from "@/services/menuService";
import { Menu } from "@/types";
import { Box, Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import useSearch from "@/hooks/useSearch";
import { LOCAL_STORAGE_EMPLOYEE_TOKEN } from "@/constants";
import Button from "@/components/button";
import NewMenuModal from "@/components/menu/newMenuModal";

export default function EditMenu() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [filterdMenus, setSearchQuery] = useSearch(menus, (menus, searchQuery) =>
    menus.map((menu) => ({
      catagory: menu.catagory,
      items: menu.items.filter((item) => item.name.includes(searchQuery)),
    })),
  );
  const [token, setToken] = useLocalStorage(LOCAL_STORAGE_EMPLOYEE_TOKEN, "");
  const [newMenuModal, setNewMenuModal] = useState<boolean>(false);

  useEffect(() => {
    getEditMenu(token)
      .then((menus) => {
        setMenus(menus);
      })
      .catch((err) => console.log(err));
  }, [token]);

  const onOpenNewMenuModal = () => setNewMenuModal(true);
  const onCloseNewMenuModal = () => setNewMenuModal(false);

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
          <Button label="เพิ่มเมนูอาหาร" onClick={onOpenNewMenuModal} />
          <TextField label="ค้นหาเมนูตามชื่อ" onChange={(e) => setSearchQuery(e.target.value)} />
          <Stack spacing={2} width={"100%"}>
            {filterdMenus.map((menu) => (
              <Stack spacing={1} key={menu.catagory}>
                <Heading>{menu.catagory}</Heading>
                {menu.items.map((menuItem) => (
                  <EditMenuCard key={menuItem.id} menuItem={menuItem} />
                ))}
              </Stack>
            ))}
          </Stack>
        </Stack>
        <NewMenuModal
          state={newMenuModal}
          onClose={onCloseNewMenuModal}
          onOpen={onOpenNewMenuModal}
        />
      </Container>
    </main>
  );
}
