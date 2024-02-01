import { Box, Modal, Stack } from "@mui/material";
import Heading from "../typo/heading";
import SubHeading from "../typo/subHeading";
import Body from "../typo/body";
import { nanoSecondToHourMinute } from "@/util/duration";
import Title from "../typo/title";
import Card from "../card";
import Button from "../button";
import { useEffect, useState } from "react";
import { CheckoutSummaryObject } from "@/types";
import Swal from "sweetalert2";
import useEmployeeToken from "@/hooks/useEmployeeToken";
import { checkout, getCheckoutSummary } from "@/services/transactionService";
import LimitHeightModalStack from "../limitHeightModalStack";

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
  const token = useEmployeeToken();
  const [checkoutSummary, setCheckoutSummary] = useState<CheckoutSummaryObject>({
    tableNumber: 0,
    size: 0,
    promotionName: "",
    remainingDuration: 0,
    totalPrice: 0,
    startPrice: 0,
    orderPrice: 0,
    orderItems: [],
    createdAt: "",
  });

  useEffect(() => {
    if (token) {
      getCheckoutSummary(clientToken, token)
        .then((summary) => setCheckoutSummary(summary))
        .catch((err) => console.log(err));
    }
  }, [token, state]);

  const onCheckout = () => {
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
        <LimitHeightModalStack>
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
            height={"100%"}
            sx={{ overflowY: "auto" }}
            spacing={"4px"}
          >
            {checkoutSummary.orderItems.map((orderItem) => (
              <Stack direction={"row"} key={orderItem.menuItemId}>
                <Title>{orderItem.name}</Title>
                <Stack direction={"row"} sx={{ marginLeft: "auto" }} spacing={"4px"}>
                  <Card label={`${orderItem.price}฿`} bgcolor="#D12600" />
                  <Card label={`x${orderItem.quantity}`} />
                </Stack>
              </Stack>
            ))}
          </Stack>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            padding={1}
            spacing={"4px"}
            bgcolor={"#E6E6E5"}
            borderRadius={"10px"}
          >
            <Stack direction={"row"} spacing={"4px"}>
              <Card label={`ราคาเริ่มต้น: ${checkoutSummary.startPrice}฿`} bgcolor="#D12600" />
              <Card label={`ราคาคำสั่งอาหาร: ${checkoutSummary.orderPrice}฿`} bgcolor="#D12600" />
            </Stack>
            <Box>
              <Card label={`ราคารวม: ${checkoutSummary.totalPrice}฿`} bgcolor="#D12600" />
            </Box>
          </Stack>
          <Button label="ยืนยัน" onClick={onCheckout} />
          <Button label="ปิด" myVariant="secondary" onClick={onClose} />
        </LimitHeightModalStack>
      </Box>
    </Modal>
  );
}
