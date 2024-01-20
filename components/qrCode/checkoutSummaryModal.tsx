import { Box, Modal, Stack } from "@mui/material";
import ModalStack from "../modalStack";
import Heading from "../typo/heading";
import SubHeading from "../typo/subHeading";
import Body from "../typo/body";
import { durationSince, nanoSecondToHourMinute } from "@/util/duration";
import Title from "../typo/title";
import Card from "../card";
import Button from "../button";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { CheckoutSummaryObject } from "@/types";
import { checkout, getCheckoutSummary } from "@/services/qrCodeService";
import { LOCAL_STORAGE_EMPLOYEE_TOKEN } from "@/constants";
import Swal from "sweetalert2";

interface Props {
  state: boolean;
  onClose: () => void;
  onOpen: () => void;
  clientToken: string;
  refreshQrCodes: () => void;
}

export default function CheckoutSummaryModal({
  state,
  onClose,
  onOpen,
  clientToken,
  refreshQrCodes,
}: Props) {
  const [token, setToken] = useLocalStorage(LOCAL_STORAGE_EMPLOYEE_TOKEN, "");
  const [checkoutSummary, setCheckoutSummary] = useState<CheckoutSummaryObject>({
    tableNumber: 0,
    size: 0,
    promotionName: "",
    remainingDuration: 0,
    totalPrice: 0,
    orderItems: [],
    createdAt: "",
  });

  useEffect(() => {
    getCheckoutSummary(clientToken, token)
      .then((summary) => setCheckoutSummary(summary))
      .catch((err) => console.log(err));
  }, [token]);

  const onCheckout = () => {
    onClose();
    checkout(clientToken, token)
      .then(() => {
        refreshQrCodes();
        Swal.fire({
          title: "คิดเงินสำเร็จ",
          icon: "success",
          confirmButtonText: "ตกลง",
        });
      })
      .catch((err: Error) => {
        Swal.fire({
          title: "คิดเงินล้มเหลว",
          text: err.message,
          icon: "error",
          confirmButtonAriaLabel: "ตกลง",
        });
      });
  };

  const hoursMinutes = nanoSecondToHourMinute(checkoutSummary.remainingDuration);

  return (
    <Modal open={state} onClose={onClose}>
      <Box>
        <ModalStack>
          <Heading>เช็คบิล</Heading>
          <Stack bgcolor={"#E6E6E5"} p={1} borderRadius={"16px"}>
            <Body>{`โต๊ะที่: ${checkoutSummary.tableNumber}`}</Body>
            <Body>{`เวลาคงเหลือ: ${hoursMinutes.hours} ชั่วโมง ${hoursMinutes.minutes} นาที`}</Body>
            <Body>{`โปรโมชั่น: ${checkoutSummary.promotionName}`}</Body>
            <Body>{`จำนวนคน: ${checkoutSummary.size}`}</Body>
            <Body>{`เข้าร้านเมื่อ: ${checkoutSummary.createdAt}`}</Body>
          </Stack>
          <SubHeading>รายการอาหารทั้งหมด</SubHeading>
          <Stack
            bgcolor={"#E6E6E5"}
            p={1}
            borderRadius={"16px"}
            minHeight={"420px"}
            maxHeight={"420px"}
            sx={{ overflowY: "auto" }}
            spacing={"4px"}
          >
            {checkoutSummary.orderItems.map((orderItem) => (
              <Stack direction={"row"} key={orderItem.name}>
                <Title>{orderItem.name}</Title>
                <Stack direction={"row"} sx={{ marginLeft: "auto" }} spacing={"4px"}>
                  <Card label={`${orderItem.price}฿`} bgcolor="#D12600" />
                  <Card label={`x${orderItem.quantity}`} />
                </Stack>
              </Stack>
            ))}
          </Stack>
          <Stack direction={"row"} padding={1} bgcolor={"#E6E6E5"} borderRadius={"10px"}>
            <Box sx={{ marginLeft: "auto" }}>
              <Card label={`ราคารวม: ${checkoutSummary.totalPrice}฿`} bgcolor="#D12600" />
            </Box>
          </Stack>
          <Button label="ยืนยัน" onClick={onCheckout} />
          <Button label="ปิด" myVariant="secondary" onClick={onClose} />
        </ModalStack>
      </Box>
    </Modal>
  );
}
