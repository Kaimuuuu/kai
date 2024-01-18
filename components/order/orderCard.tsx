import { Box, Stack, Card as MuiCard } from "@mui/material";
import Heading from "../typo/heading";
import Button from "../button";
import Card from "../card";
import { EmployeeRole, Order, OrderStatus } from "@/types";
import Title from "../typo/title";
import Body from "../typo/body";
import { updateOrderStatus } from "@/services/orderService";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_EMPLOYEE_TOKEN, LOCAL_STORAGE_ROLE } from "@/constants";
import Swal from "sweetalert2";

interface Props {
  order: Order;
  refreshOrders: () => void;
}

export default function OrderCard({ order, refreshOrders }: Props) {
  const [token, setToken] = useLocalStorage(LOCAL_STORAGE_EMPLOYEE_TOKEN, "");
  const [role, setRole] = useLocalStorage(LOCAL_STORAGE_ROLE, "");

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
          {order.orderItems.map((item) => (
            <Stack direction={"row"} key={item.name}>
              <Title>{item.name}</Title>
              <Stack direction={"row"} marginLeft={"auto"} spacing={"4px"}>
                {item.outOfStock && <Card label={`หมด`} bgcolor="#000000" />}
                <Card label={`x${item.quantity}`} />
              </Stack>
            </Stack>
          ))}
        </Stack>
        <Body bold>{`โต๊ะที่: ${order.tableNumber}`}</Body>
        {(Number(role) === EmployeeRole.Chef || Number(role) === EmployeeRole.Admin) && (
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
