import { Box, Modal, Stack } from "@mui/material";
import ModalStack from "../modalStack";
import Heading from "../typo/heading";
import Title from "../typo/title";
import Button from "../button";
import Card from "../card";
import { CartItem } from "@/types";
import { createOrder } from "@/services/orderService";
import Swal from "sweetalert2";
import useClientToken from "@/hooks/useClientToken";

interface Props {
  state: boolean;
  onOpen: () => void;
  onClose: () => void;
  cart: CartItem[];
  resetCart: () => void;
}

export default function SummaryOrderModal({ state, onOpen, onClose, cart, resetCart }: Props) {
  const token = useClientToken();

  const onClickOrder = () => {
    onClose();

    if (!cart.length) {
      Swal.fire({
        title: "สั่งอาหารล้มเหลว",
        text: "กรุณาเลือกอาหารที่ต้องการสั่ง (ตะกร้าว่างเปล่า)",
        icon: "error",
        confirmButtonAriaLabel: "ตกลง",
      });
      return;
    }

    createOrder(token, cart)
      .then(() => {
        Swal.fire({
          title: "สั่งอาหารสำเร็จ",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
        resetCart();
      })
      .catch((err: Error) => {
        Swal.fire({
          title: "สั่งอาหารล้มเหลว",
          text: err.message,
          icon: "error",
          confirmButtonAriaLabel: "ตกลง",
        });
        resetCart();
      });
  };

  return (
    <Modal open={state} onClose={onClose}>
      <Box>
        <ModalStack>
          <Heading>รายการอาหาร</Heading>
          <Stack padding={1} bgcolor={"#E6E6E5"} borderRadius={"10px"} spacing={"10px"}>
            {cart.length === 0 ? (
              <Stack direction={"row"}>
                <Title>ไม่มีเมนูในรถเข็น</Title>
              </Stack>
            ) : (
              cart.map((cartItem) => (
                <Stack direction={"row"} key={cartItem.menuItemId}>
                  <Title>{cartItem.name}</Title>
                  <Stack direction={"row"} marginLeft={"auto"} spacing={"4px"}>
                    <Card label={`${cartItem.price}฿`} bgcolor="#D12600" />
                    <Card label={`x${cartItem.quantity}`} />
                  </Stack>
                </Stack>
              ))
            )}
          </Stack>
          <Stack direction={"row"} padding={1} bgcolor={"#E6E6E5"} borderRadius={"10px"}>
            <Box marginLeft="auto">
              <Card
                label={`ราคารวม: ${cart.reduce((accu, cartItem) => accu + cartItem.price * cartItem.quantity, 0)}฿`}
                bgcolor="#D12600"
              />
            </Box>
          </Stack>
          <Button label="ยืนยันการสั่งอาหาร" onClick={onClickOrder} />
          <Button label="ยกเลิก" myVariant="secondary" onClick={onClose} />
        </ModalStack>
      </Box>
    </Modal>
  );
}
