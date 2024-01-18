"use client";

import Button from "@/components/button";
import Navbar from "@/components/layout/navbar";
import PromotionCard from "@/components/promotion/promotionCard";
import Heading from "@/components/typo/heading";
import { getPromotions } from "@/services/promotionService";
import { EmployeeRole, Promotion as PromotionType } from "@/types";
import { Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import NewPromotionModal from "@/components/promotion/newPromotionModal";
import { LOCAL_STORAGE_EMPLOYEE_TOKEN, LOCAL_STORAGE_ROLE } from "@/constants";

export default function Promotion() {
  const [promotions, setPromotions] = useState<PromotionType[]>([]);
  const [newPromotionModal, setNewPromotionModal] = useState<boolean>(false);
  const [token, setToken] = useLocalStorage(LOCAL_STORAGE_EMPLOYEE_TOKEN, "");
  const [role, setRole] = useLocalStorage(LOCAL_STORAGE_ROLE, "-1");
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    getPromotions(token, Number(role))
      .then((promotions) => setPromotions(promotions))
      .catch((err) => console.log(err));
  }, [token, refresh]);

  const onOpenNewPromotionModal = () => setNewPromotionModal(true);
  const onCloseNewPromotionModal = () => setNewPromotionModal(false);

  const refreshing = () => setRefresh(!refresh);

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
          {Number(role) === EmployeeRole.Admin && (
            <Button label="สร้าง Promotion" onClick={onOpenNewPromotionModal} />
          )}
          {promotions.map((promotion) => (
            <PromotionCard
              promotion={promotion}
              key={promotion.name}
              refreshPromotions={refreshing}
            />
          ))}
        </Stack>
        {Number(role) === EmployeeRole.Admin && (
          <NewPromotionModal
            onOpen={onOpenNewPromotionModal}
            onClose={onCloseNewPromotionModal}
            state={newPromotionModal}
            refreshPromotions={refreshing}
          />
        )}
      </Container>
    </main>
  );
}
