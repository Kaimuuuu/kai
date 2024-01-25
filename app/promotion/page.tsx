"use client";

import Button from "@/components/button";
import Navbar from "@/components/layout/navbar";
import PromotionCard from "@/components/promotion/promotionCard";
import Heading from "@/components/typo/heading";
import { getPromotions } from "@/services/promotionService";
import { EmployeeRole, Promotion as PromotionType } from "@/types";
import { Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import NewPromotionModal from "@/components/promotion/newPromotionModal";
import useEmployeeToken from "@/hooks/useEmployeeToken";
import useRole from "@/hooks/useRole";
import Loading from "@/components/loading";

export default function Promotion() {
  const [promotions, setPromotions] = useState<PromotionType[]>([]);
  const [newPromotionModal, setNewPromotionModal] = useState<boolean>(false);
  const token = useEmployeeToken();
  const role = useRole();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      getPromotions(token, role)
        .then((promotions) => {
          setPromotions(promotions);
          setIsLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [token, refresh]);

  const onOpenNewPromotionModal = () => setNewPromotionModal(true);
  const onCloseNewPromotionModal = () => setNewPromotionModal(false);

  const refreshing = () => setRefresh(!refresh);

  if (isLoading) {
    return <Loading />
  }

  return (
    <main
      style={{
        paddingTop: "20px",
        paddingBottom: "20px",
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
