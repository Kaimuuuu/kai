import { OrderItem } from "@/types";
import { Box, Modal, Stack } from "@mui/material";
import ModalStack from "../modalStack";
import Heading from "../typo/heading";
import Title from "../typo/title";
import Card from "../card";
import Button from "../button";

interface Props {
  state: boolean;
  onClose: () => void;
  onOpen: () => void;
  orderItems: OrderItem[];
}

export default function TransactionOrderModal({ state, onClose, onOpen, orderItems }: Props) {
  return (
    <Modal open={state} onClose={onClose}>
      <Box>
        <ModalStack>
          <Heading>รายการอาหาร</Heading>
          <Stack
            padding={1}
            bgcolor={"#E6E6E5"}
            borderRadius={"10px"}
            spacing={"10px"}
            overflow={"hidden"}
            sx={{ overflowY: "auto" }}
          >
            {orderItems.map((orderItem) => (
              <Stack direction={"row"} key={orderItem.menuItemId}>
                <Title>{orderItem.name}</Title>
                <Stack direction={"row"} marginLeft={"auto"} spacing={"4px"}>
                  <Card label={`${orderItem.price}฿`} bgcolor="#D12600" />
                  <Card label={`x${orderItem.quantity}`} />
                </Stack>
              </Stack>
            ))}
          </Stack>
          <Stack direction={"row"} padding={1} bgcolor={"#E6E6E5"} borderRadius={"10px"}>
            <Box marginLeft="auto">
              <Card
                label={`ราคาคำสั่งอาหาร: ${orderItems.reduce((accu, cartItem) => accu + cartItem.price * cartItem.quantity, 0)}฿`}
                bgcolor="#D12600"
              />
            </Box>
          </Stack>
          <Button label="ปิด" myVariant="secondary" onClick={onClose} />
        </ModalStack>
      </Box>
    </Modal>
  );
}
