"use client";

import Button from "@/components/button";
import TextField from "@/components/textField";
import MenuCard from "@/components/menu/menuCard";
import Heading from "@/components/typo/heading";
import { getMenu, pollMenu } from "@/services/menuService";
import { CartItem, Menu, MenuItem } from "@/types";
import { Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import SummaryOrderHistoryModal from "@/components/order/summaryOrderHistoryModal";
import SummaryOrderModal from "@/components/order/summaryOrderModal";
import useSearch from "@/hooks/useSearch";
import Recommands from "@/components/recommands";
import Tags from "@/components/tags";
import { ID_MENU_CATAGORY } from "@/constants";
import useClientToken from "@/hooks/useClientToken";
import Loading from "@/components/loading";
import { meClient } from "@/services/authService";
import ShoppingFixedButton from "@/components/shoppingFixedButton";
import ClientTokenError from "@/components/clientTokenError";

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [filteredMenus, setSearchQuery] = useSearch(menus, (menus, searchQuery) =>
    menus.map((menu) => ({
      catagory: menu.catagory,
      items: menu.items.filter((menuItem) => menuItem.name.includes(searchQuery)),
    })),
  );
  const [summaryOderModal, setSummaryOrderModal] = useState<boolean>(false);
  const [summaryOrderHistoryModal, setSummaryOrderHistoryModal] = useState<boolean>(false);
  const token = useClientToken();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    if (token && isLoading) {
      meClient(token).catch((err) => {
        setIsError(true);
      });
    }
  }, [token, isLoading]);

  useEffect(() => {
    if (token) {
      getMenu(token)
        .then((menus) => {
          setMenus(menus);
          setIsLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [token, refresh]);

  useEffect(() => {
    if (!isLoading) {
      const poll = () => {
        pollMenu(token)
          .then((menus) => {
            setMenus(menus);
            poll();
          })
          .catch((err) => console.log(err));
      };

      poll();
    }
  }, [isLoading]);

  const tags = menus.map((menu) => menu.catagory);

  const addMenuItem = (menuItem: MenuItem) => {
    const cartItem = cart.find((cartItem) => cartItem.menuItemId == menuItem.id);

    if (cartItem !== undefined) {
      ++cartItem.quantity;
      setCart([...cart]);
    } else {
      const newCartItem = {
        menuItemId: menuItem.id,
        name: menuItem.name,
        quantity: 1,
        price: menuItem.price,
      };

      setCart([...cart, newCartItem]);
    }

    console.log(cart);
  };

  const removeMenuItem = (menuItemId: string) => {
    const cartItem = cart.find((cartItem) => cartItem.menuItemId == menuItemId);

    if (cartItem !== undefined) {
      --cartItem.quantity;
      setCart([...cart]);

      if (cartItem.quantity === 0) {
        setCart(cart.filter((cartItem) => cartItem.menuItemId !== menuItemId));
      }
    }

    console.log(cart);
  };

  const resetCart = () => setCart([]);

  const onClickReset = () => {
    Swal.fire({
      title: "ต้องการที่จะรีเซ็ตคำสั่งอาหารในรถเข็นทั้งหมด?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        resetCart();
      }
    });
  };

  const onOpenSummaryOrderHistoryModal = () => setSummaryOrderHistoryModal(true);
  const onCloseSummaryOrderHistoryModal = () => setSummaryOrderHistoryModal(false);

  const onOpenSummaryOrderModal = () => setSummaryOrderModal(true);
  const onCloseSummaryOrderModal = () => setSummaryOrderModal(false);

  if (isError) {
    return <ClientTokenError />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main
      style={{
        paddingTop: "20px",
        paddingBottom: "80px",
      }}
    >
      <Container>
        <ShoppingFixedButton itemLength={cart.length} onClick={onOpenSummaryOrderModal} />
        <Recommands />
        <Tags tags={tags} />
        <Stack sx={{ paddingBottom: "12px" }}>
          <Stack direction={"row"} spacing={1} paddingTop={2} paddingBottom={2}>
            <Stack direction={"row"} spacing={1} width={"100%"}>
              <Button
                myVariant="secondary"
                label="ยอดรวม"
                onClick={onOpenSummaryOrderHistoryModal}
              />
              <Button myVariant="secondary" label="รีเซ็ต" onClick={onClickReset} />
            </Stack>
            <Button label="สั่งอาหาร" onClick={onOpenSummaryOrderModal} />
          </Stack>
          <TextField label="ค้นหาตามชื่อเมนู" onChange={(e) => setSearchQuery(e.target.value)} />
        </Stack>
        <Stack spacing={2}>
          {filteredMenus.map((menu) => (
            <Stack spacing={1} key={menu.catagory} id={`${ID_MENU_CATAGORY}_${menu.catagory}`}>
              <Heading>{menu.catagory}</Heading>
              {menu.items.map((menuItem) => (
                <MenuCard
                  key={menuItem.id}
                  menuItem={menuItem}
                  quantity={
                    cart.find((cartItem) => cartItem.menuItemId === menuItem.id)?.quantity ?? 0
                  }
                  onAdd={addMenuItem}
                  onRemove={removeMenuItem}
                />
              ))}
            </Stack>
          ))}
        </Stack>
      </Container>
      <SummaryOrderHistoryModal
        state={summaryOrderHistoryModal}
        onOpen={onOpenSummaryOrderHistoryModal}
        onClose={onCloseSummaryOrderHistoryModal}
      />
      <SummaryOrderModal
        state={summaryOderModal}
        onOpen={onOpenSummaryOrderModal}
        onClose={onCloseSummaryOrderModal}
        cart={cart}
        resetCart={resetCart}
      />
    </main>
  );
}
