import { Stack, Card as MuiCard, Box, Modal } from "@mui/material";
import Image from "next/image";
import SubHeading from "../typo/subHeading";
import Body from "../typo/body";
import { QrCode as QrCodeType } from "@/types";
import { durationSince } from "@/util/duration";
import Button from "../button";
import { useState } from "react";
import ModalStack from "../modalStack";
import CheckoutSummaryModal from "./checkoutSummaryModal";

interface Props {
  qrCode: QrCodeType;
}

export default function QrCodeCard({ qrCode }: Props) {
  const [viewModal, setViewModal] = useState<boolean>(false);
  const [checkoutSummaryModal, setCheckoutSummaryModal] = useState<boolean>(false);

  const onCloseViewModal = () => setViewModal(false);
  const onOpenViewModal = () => setViewModal(true);

  const onCloseCheckoutSummaryModal = () => setCheckoutSummaryModal(false);
  const onOpenCheckoutSummaryModal = () => setCheckoutSummaryModal(true);

  return (
    <MuiCard sx={{ borderRadius: "16px", width: "100%" }}>
      <Stack sx={{ padding: "12px" }} spacing="12px">
        <Stack direction={"row"} spacing="12px">
          <Stack spacing={"10px"}>
            <div
              style={{
                maxWidth: "130px",
                maxHeight: "130px",
                borderRadius: "16px",
                overflow: "hidden",
                height: "fit-content",
              }}
            >
              <Image
                style={{ filter: "blur(4px)" }}
                src={`${process.env.BACKEND_URL}/qrcode/${qrCode.token}`}
                alt="Next.js Logo"
                width={130}
                height={130}
                priority
              />
            </div>
            <Button myVariant="secondary" label="ดู" onClick={onOpenViewModal} />
          </Stack>
          <Stack sx={{ width: "100%" }}>
            <SubHeading>{`โต๊ะที่: ${qrCode.tableNumber}`}</SubHeading>
            <Body bold>{`เวลาคงเหลือ: ${durationSince(new Date(qrCode.expire))}`}</Body>
            <Body>{`โปรโมชั่น: ${qrCode.promotionName}`}</Body>
            <Body>{`จำนวนคน: ${qrCode.size}`}</Body>
            <Body>{`เข้าร้านเมื่อ: ${qrCode.createdAt}`}</Body>
            <Box marginTop={"auto"}>
              <Button label="เช็คบิล" onClick={onOpenCheckoutSummaryModal} />
            </Box>
          </Stack>
        </Stack>
      </Stack>
      <Modal open={viewModal} onClose={() => setViewModal(false)}>
        <Box>
          <ModalStack>
            <div
              style={{
                maxWidth: "300px",
                maxHeight: "300px",
                borderRadius: "16px",
                overflow: "hidden",
                height: "fit-content",
                margin: "auto",
              }}
            >
              <Image
                src={`${process.env.BACKEND_URL}/qrcode/${qrCode.token}`}
                alt="Next.js Logo"
                width={300}
                height={300}
                priority
              />
            </div>
            {/* <Button label='ปริ้น' /> */}
            <Button label="ปิด" myVariant="secondary" onClick={onCloseViewModal} />
          </ModalStack>
        </Box>
      </Modal>
      <CheckoutSummaryModal
        state={checkoutSummaryModal}
        onOpen={onOpenCheckoutSummaryModal}
        onClose={onCloseCheckoutSummaryModal}
        clientToken={qrCode.token}
      />
    </MuiCard>
  );
}
