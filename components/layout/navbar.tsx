import { getNavbar } from "@/services/navbarService";
import { NavItem } from "@/types";
import { useEffect, useState } from "react";
import Button from "../button";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_EMPLOYEE_TOKEN, LOCAL_STORAGE_ROLE } from "@/constants";

export default function Navbar() {
  const [navbarItems, setNavItems] = useState<NavItem[]>([]);
  const router = useRouter();
  const [role, setRole] = useLocalStorage(LOCAL_STORAGE_ROLE, "-1");

  useEffect(() => {
    const navbarItems = getNavbar(Number(role));
    setNavItems(navbarItems);
  }, [role]);

  const onLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_EMPLOYEE_TOKEN)
    localStorage.removeItem(LOCAL_STORAGE_ROLE)

    router.push("/login")
  }

  return (
    <Stack spacing={"10px"} marginBottom={"20px"}>
      {navbarItems.map((navbatItem) => (
        <Button
          label={navbatItem.name}
          key={navbatItem.name}
          onClick={() => router.push(navbatItem.path)}
        />
      ))}
      <Button label={"ออกจากระบบ"} myVariant="danger" onClick={onLogout} />
    </Stack>
  );
}
