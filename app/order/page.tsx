"use client";

import Button from "@/components/button";
import Navbar from "@/components/layout/navbar";
import Loading from "@/components/loading";
import OrderCard from "@/components/order/orderCard";
import Heading from "@/components/typo/heading";
import useEmployeeToken from "@/hooks/useEmployeeToken";
import { me } from "@/services/authService";
import { getOrder, updateOrderItemsStatus } from "@/services/orderService";
import { Order as OrderType, UpdateOrderItemStatus } from "@/types";
import { Container, Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Order() {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const token = useEmployeeToken();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [changedOrderItems, setChangedOrderItems] = useState<UpdateOrderItemStatus[]>([]);
  const [clearChangedOrderItems, setClearChangedOrderItems] = useState<boolean>(false);
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

  const onUpdateOrderItemsStatus = () => {
    Swal.fire({
      title: `ต้องการที่จะอัพเดจสถานะคำสั่งอาหารหรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        setChangedOrderItems([]);
        refreshing();
        if (!changedOrderItems.length) {
          Swal.fire({
            title: "อัพเดจสถานะคำสั่งอาหารสำเร็จ",
            icon: "success",
            confirmButtonText: "ตกลง",
          });
          return;
        }
        updateOrderItemsStatus(token, changedOrderItems)
          .then(() => {
            Swal.fire({
              title: "อัพเดจสถานะคำสั่งอาหารสำเร็จ",
              icon: "success",
              confirmButtonText: "ตกลง",
            });
          })
          .catch((err: Error) => {
            Swal.fire({
              title: "อัพเดจสถานะคำสั่งอาหารล้มเหลว",
              text: err.message,
              icon: "error",
              confirmButtonText: "ตกลง",
            });
          });
      }
    });
  };

  const onClearChangedOrderItems = () => {
    setClearChangedOrderItems(!clearChangedOrderItems);
  };

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
          <Stack spacing={"10px"} width={"100%"} minHeight={"30px"} direction={"row"}>
            {changedOrderItems.length !== 0 && (
              <>
                <Button label="ยกเลิก" myVariant="danger" onClick={onClearChangedOrderItems} />
                <Button label="แก้ไข" onClick={onUpdateOrderItemsStatus} />
              </>
            )}
          </Stack>
          {orders.map((order) => (
            <OrderCard
              order={order}
              key={order.id}
              refreshOrders={refreshing}
              changedOrderItems={changedOrderItems}
              setChangedOrderItems={setChangedOrderItems}
              clearChangedOrderItems={clearChangedOrderItems}
            />
          ))}
        </Stack>
      </Container>
    </main>
  );
}
