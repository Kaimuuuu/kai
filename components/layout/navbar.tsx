import { getNavbar } from "@/services/navbarService";
import { NavItem } from "@/types";
import { useEffect, useState } from "react";
import Button from "../button";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { LOCAL_STORAGE_EMPLOYEE_TOKEN, LOCAL_STORAGE_ROLE } from "@/constants";
import useRole from "@/hooks/useRole";

export default function Navbar() {
  const [navbarItems, setNavItems] = useState<NavItem[]>([]);
  const router = useRouter();
  const role = useRole();

  useEffect(() => {
    const navbarItems = getNavbar(role);
    setNavItems(navbarItems);
  }, [role]);

  const onLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_EMPLOYEE_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE_ROLE);

    router.push("/login");
  };

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
