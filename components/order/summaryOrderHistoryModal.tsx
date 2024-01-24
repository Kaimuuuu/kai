import { Box, Modal, Stack } from "@mui/material";
import ModalStack from "../modalStack";
import Heading from "../typo/heading";
import { useEffect, useState } from "react";
import { OrderStatus, SummaryOrderHistory } from "@/types";
import { getSummaryOrderHistory } from "@/services/orderService";
import Title from "../typo/title";
import Card from "../card";
import Button from "../button";
import useClientToken from "@/hooks/useClientToken";

interface Props {
  state: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function SummaryOrderHistoryModal({ state, onOpen, onClose }: Props) {
  const [summaryOrders, setSummaryOrders] = useState<SummaryOrderHistory>({
    orderHistory: [],
    totalPrice: 0,
  });
  const token = useClientToken();

  useEffect(() => {
    getSummaryOrderHistory(token)
      .then((orders) => {
        setSummaryOrders(orders);
      })
      .catch((err) => console.log(err));
  }, [state, token]);

  return (
    <Modal open={state} onClose={onClose}>
      <Box>
        <ModalStack>
          <Heading>รายการอาหารทั้งหมด</Heading>
          <Stack spacing={"8px"} maxHeight={"450px"} overflow={"hidden"} sx={{ overflowY: "auto" }}>
            {summaryOrders.orderHistory.map((order) => (
              <Box key={order.id}>
                <Stack
                  padding={1}
                  bgcolor={"#E6E6E5"}
                  borderRadius={"10px 10px 0px 0px"}
                  spacing={"10px"}
                >
                  {order.orderItems.map((item) => (
                    <Stack direction={"row"} key={item.name}>
                      <Title>{item.name}</Title>
                      <Stack marginLeft={"auto"} direction={"row"} spacing={"4px"}>
                        {item.outOfStock && <Card label={`หมด`} bgcolor="#000000" />}
                        <Card label={`${item.price}฿`} bgcolor="#D12600" />
                        <Card label={`x${item.quantity}`} />
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
                {order.status === OrderStatus.Success ? (
                  <Stack
                    alignItems={"center"}
                    padding={"4px 10px"}
                    borderRadius={"0px 0px 10px 10px"}
                    bgcolor={"#3AD98A"}
                    color={"white"}
                  >
                    <Title>{`สำเร็จ`}</Title>
                  </Stack>
                ) : order.status === OrderStatus.Decline ? (
                  <Stack
                    alignItems={"center"}
                    padding={"4px 10px"}
                    borderRadius={"0px 0px 10px 10px"}
                    bgcolor={"#FF5C5C"}
                    color={"white"}
                  >
                    <Title>{`ถูกยกเลิก`}</Title>
                  </Stack>
                ) : (
                  <Stack
                    alignItems={"center"}
                    padding={"4px 10px"}
                    borderRadius={"0px 0px 10px 10px"}
                    bgcolor={"#FF6D4D"}
                    color={"white"}
                  >
                    <Title>{`กำลังดำเนินการ`}</Title>
                  </Stack>
                )}
              </Box>
            ))}
          </Stack>
          <Stack direction={"row"} padding={1} bgcolor={"#E6E6E5"} borderRadius={"10px"}>
            <Box marginLeft={"auto"}>
              <Card label={`ยอดรวม: ${summaryOrders.totalPrice}฿`} bgcolor="#D12600" />
            </Box>
          </Stack>
          <Button label="ปิด" myVariant="secondary" onClick={onClose} />
        </ModalStack>
      </Box>
    </Modal>
  );
}
