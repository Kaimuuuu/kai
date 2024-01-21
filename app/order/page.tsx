"use client";

import Navbar from "@/components/layout/navbar";
import OrderCard from "@/components/order/orderCard";
import Heading from "@/components/typo/heading";
import { LOCAL_STORAGE_EMPLOYEE_TOKEN } from "@/constants";
import useLocalStorage from "@/hooks/useLocalStorage";
import { getOrder } from "@/services/orderService";
import { Order as OrderType } from "@/types";
import { Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";

export default function Order() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [token, setToken] = useLocalStorage(LOCAL_STORAGE_EMPLOYEE_TOKEN, "");
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    getOrder(token)
      .then((orders) => {
        setOrders(orders);
      })
      .catch((err) => console.log(err));

    const pollingId = setInterval(() => {
      refreshing();
    }, 5 * 1e3);

    return () => clearInterval(pollingId);
  }, [token, refresh]);

  const refreshing = () => {
    setRefresh(!refresh);
  }

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
          <Heading>รายการสั่งอาหาร</Heading>
          {orders.map((order) => (
            <OrderCard order={order} key={order.id} refreshOrders={refreshing} />
          ))}
        </Stack>
      </Container>
    </main>
  );
}
