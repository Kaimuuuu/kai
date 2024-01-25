"use client";

import Navbar from "@/components/layout/navbar";
import Loading from "@/components/loading";
import OrderCard from "@/components/order/orderCard";
import Heading from "@/components/typo/heading";
import useEmployeeToken from "@/hooks/useEmployeeToken";
import { getOrder } from "@/services/orderService";
import { Order as OrderType } from "@/types";
import { Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";

export default function Order() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const token = useEmployeeToken();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      getOrder(token)
        .then((orders) => {
          setOrders(orders);
          setIsLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [token, refresh]);

  useEffect(() => {
    if (!isLoading) {
      const pollingId = setInterval(() => {
        refreshing();
      }, 5 * 1e3);

      return () => clearInterval(pollingId);
    }
  }, [refresh, isLoading]);

  const refreshing = () => {
    setRefresh(!refresh);
  };

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
          <Heading>รายการสั่งอาหาร</Heading>
          {orders.map((order) => (
            <OrderCard order={order} key={order.id} refreshOrders={refreshing} />
          ))}
        </Stack>
      </Container>
    </main>
  );
}
