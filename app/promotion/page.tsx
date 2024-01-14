"use client";

import Button from "@/components/button";
import Navbar from "@/components/layout/navbar";
import PromotionCard from "@/components/promotion/promotionCard";
import Heading from "@/components/typo/heading";
import { getPromotion } from "@/services/promotionService";
import { Promotion as PromotionType } from "@/types";
import { Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import NewPromotionModal from "@/components/promotion/newPromotionModal";
import { LOCAL_STORAGE_EMPLOYEE_TOKEN } from "@/constants";

export default function Promotion() {
  const [promotions, setPromotions] = useState<PromotionType[]>([]);
  const [newPromotionModal, setNewPromotionModal] = useState<boolean>(false);
  const [token, setToken] = useLocalStorage(LOCAL_STORAGE_EMPLOYEE_TOKEN, "");

  useEffect(() => {
    getPromotion(token)
      .then((promotions) => setPromotions(promotions))
      .catch((err) => console.log(err));
  }, [token]);

  const onOpenNewPromotionModal = () => setNewPromotionModal(true);
  const onCloseNewPromotionModal = () => setNewPromotionModal(false);

  return (
    <main
      style={{
        backgroundColor: "#FAFAFA",
        paddingTop: "20px",
        paddingBottom: "20px",
        minHeight: "100vh",
      }}
    >
      <Container>
        <Navbar />
        <Stack alignItems={"center"} spacing={"10px"}>
          <Heading>โปรโมชั่น</Heading>
          <Button label="สร้าง Promotion" onClick={onOpenNewPromotionModal} />
          {promotions.map((promotion) => (
            <PromotionCard promotion={promotion} key={promotion.name} />
          ))}
        </Stack>
        <NewPromotionModal
          onOpen={onOpenNewPromotionModal}
          onClose={onCloseNewPromotionModal}
          state={newPromotionModal}
        />
      </Container>
    </main>
  );
}
