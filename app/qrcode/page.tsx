"use client";

import TextField from "@/components/textField";
import Navbar from "@/components/layout/navbar";
import QrCodeCard from "@/components/qrCode/qrCodeCard";
import { getQrCode } from "@/services/qrCodeService";
import { QrCode as QrCodeType } from "@/types";
import { Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import useEmployeeToken from "@/hooks/useEmployeeToken";
import Loading from "@/components/loading";

export default function QrCode() {
  const [qrCodes, setQrCodes] = useState<QrCodeType[]>([]);
  const token = useEmployeeToken();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      getQrCode(token)
        .then((qrCodesCard) => {
          setQrCodes(qrCodesCard);
          setIsLoading(false);
        })
        .catch((err) => console.log);
    }
  }, [token, refresh]);

  const refreshing = () => {
    setRefresh(!refresh);
  };

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
          <TextField label="ค้นหาตามเลขโต๊ะ" />
          {qrCodes.map((qr) => (
            <QrCodeCard qrCode={qr} key={qr.tableNumber} refreshQrCodes={refreshing} />
          ))}
        </Stack>
      </Container>
    </main>
  );
}
