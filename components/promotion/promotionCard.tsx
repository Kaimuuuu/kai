import { Stack, Card as MuiCard } from "@mui/material";
import { Promotion } from "@/types";
import { useState } from "react";
import SubHeading from "../typo/subHeading";
import Body from "../typo/body";
import Button from "../button";
import GenerateQrCodeModal from "./generateQrCodeModal";
import DetailPromotionModal from "./detailPromotionModal";
import MyImage from "../image";

interface Props {
  promotion: Promotion;
}

export default function PromotionCard({ promotion }: Props) {
  const [genQrCodeModal, setGenQrCodeModal] = useState<boolean>(false);
  const [detailModal, setDetailModal] = useState<boolean>(false);

  const onOpenGenQrCodeModal = () => setGenQrCodeModal(true);
  const onCloseGenQrCodeModal = () => setGenQrCodeModal(false);

  const onOpenDetailModal = () => setDetailModal(true);
  const onCloseDetailModal = () => setDetailModal(false);

  return (
    <MuiCard sx={{ borderRadius: "16px", width: "100%" }}>
      <Stack sx={{ padding: "12px" }} spacing="12px">
        <Stack direction={"row"} spacing="12px">
          <div>
            <div
              style={{
                maxWidth: "130px",
                maxHeight: "130px",
                borderRadius: "16px",
                overflow: "hidden",
                height: "fit-content",
              }}
            >
              <MyImage imagePath={promotion.imagePath} />
            </div>
          </div>
          <Stack sx={{ width: "100%" }}>
            <SubHeading>{promotion.name}</SubHeading>
            <Body>{promotion.description}</Body>
            <Stack marginTop={"auto"}>
              <Body bold>{`ราคา: ${promotion.price}฿`}</Body>
            </Stack>
          </Stack>
        </Stack>
        <Button label="สร้าง QR Code" onClick={onOpenGenQrCodeModal} />
        <Button myVariant="secondary" label="ดูรายละเอียด" onClick={onOpenDetailModal} />
        {promotion.editable && (
          <Button label="แก้ไข" myVariant="secondary" onClick={() => console.log("clicked")} />
        )}
      </Stack>
      <GenerateQrCodeModal
        promotion={promotion}
        state={genQrCodeModal}
        onOpen={onOpenGenQrCodeModal}
        onClose={onCloseGenQrCodeModal}
      />
      <DetailPromotionModal
        promotion={promotion}
        state={detailModal}
        onOpen={onOpenDetailModal}
        onClose={onCloseDetailModal}
      />
    </MuiCard>
  );
}
