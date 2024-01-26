import { Box, Stack, Card as MuiCard } from "@mui/material";
import Heading from "../typo/heading";
import Button from "../button";
import Card from "../card";
import {
  EmployeeRole,
  Order,
  OrderItem,
  OrderStatus,
  UpdateOrderItemStatus,
  UpdateOrderItemStatusRequest,
} from "@/types";
import Title from "../typo/title";
import Body from "../typo/body";
import { updateOrderStatus } from "@/services/orderService";
import Swal from "sweetalert2";
import useEmployeeToken from "@/hooks/useEmployeeToken";
import useRole from "@/hooks/useRole";
import Checkbox from "../checkbox";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import copy from "@/util/copy";

interface Props {
  order: Order;
  refreshOrders: () => void;
  changedOrderItems: UpdateOrderItemStatus[];
  setChangedOrderItems: Dispatch<SetStateAction<UpdateOrderItemStatus[]>>;
  clearChangedOrderItems: boolean;
}

export default function OrderCard({
  order,
  refreshOrders,
  changedOrderItems,
  setChangedOrderItems,
  clearChangedOrderItems,
}: Props) {
  const token = useEmployeeToken();
  const role = useRole();
  const [orderItems, setOrderItems] = useState<OrderItem[]>(order.orderItems);
  const [backupOrderItems, setBackupOrderItems] = useState<OrderItem[]>(copy(order.orderItems));

  useEffect(() => {
    setOrderItems(copy(backupOrderItems));
    setChangedOrderItems([]);
  }, [clearChangedOrderItems]);

  const onUpdate = (status: OrderStatus) => {
    Swal.fire({
      title: `ต้องการที่จะอัพเดจสถานะคำสั่งอาหาร "${order.id}" เป็น "${status === OrderStatus.Success ? "สำเร็จ" : "ยกเลิก"}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ตกลง",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        updateOrderStatus(token, status, order.id)
          .then(() => {
            refreshOrders();
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

  const onClickCheckbox = (item: OrderItem) => {
    item.isComplete = !item.isComplete;
    setOrderItems([...orderItems]);

    const req: UpdateOrderItemStatus = {
      orderId: order.id,
      menuItemId: item.menuItemId,
      status: item.isComplete,
    };
    const find = changedOrderItems.find((item) => item.menuItemId === req.menuItemId);
    if (find) {
      const filtered = changedOrderItems.filter((item) => item.menuItemId !== req.menuItemId);
      setChangedOrderItems(filtered);
    } else {
      setChangedOrderItems([...changedOrderItems, req]);
    }
  };

  return (
    <MuiCard sx={{ borderRadius: "16px", width: "100%" }}>
      <Stack sx={{ padding: "10px" }} spacing="10px">
        <Stack direction={"row"} alignItems={"center"}>
          <Heading>{`#${order.id}`}</Heading>
          <Box marginLeft={"auto"}>
            <Body bold>{`${order.createdAt}`}</Body>
          </Box>
        </Stack>
        <Stack padding={1} bgcolor={"#E6E6E5"} borderRadius={"10px"} spacing={"10px"}>
          {orderItems.map((item) => (
            <Stack direction={"row"} key={item.name} alignItems={"center"}>
              <Checkbox checked={item.isComplete} onClick={() => onClickCheckbox(item)} />
              <Title>{item.name}</Title>
              <Stack direction={"row"} marginLeft={"auto"} spacing={"4px"}>
                {item.outOfStock && <Card label={`หมด`} bgcolor="#000000" />}
                <Card label={`x${item.quantity}`} />
              </Stack>
            </Stack>
          ))}
        </Stack>
        <Body bold>{`โต๊ะที่: ${order.tableNumber}`}</Body>
        {(role === EmployeeRole.Chef || role === EmployeeRole.Admin) && (
          <>
            <Button label="สำเร็จ" onClick={() => onUpdate(OrderStatus.Success)} />
            <Button
              label="ยกเลิกคำสั่งอาหาร"
              myVariant="danger"
              onClick={() => onUpdate(OrderStatus.Decline)}
            />
          </>
        )}
      </Stack>
    </MuiCard>
  );
}
