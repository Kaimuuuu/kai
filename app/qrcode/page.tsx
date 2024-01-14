"use client";

import TextField from "@/components/textField";
import Navbar from "@/components/layout/navbar";
import QrCodeCard from "@/components/qrCode/qrCodeCard";
import { getQrCode } from "@/services/qrCodeService";
import { QrCode as QrCodeType } from "@/types";
import { Container, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_EMPLOYEE_TOKEN } from "@/constants";

export default function QrCode() {
  const [qrCodes, setQrCodes] = useState<QrCodeType[]>([]);
  const [token, setToken] = useLocalStorage(LOCAL_STORAGE_EMPLOYEE_TOKEN, "");

  useEffect(() => {
    getQrCode(token)
      .then((qrCodesCard) => {
        setQrCodes(qrCodesCard);
      })
      .catch((err) => console.log);
  }, [token]);

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
          <TextField label="ค้นหาตามเลขโต๊ะ" />
          {qrCodes.map((qr) => (
            <QrCodeCard qrCode={qr} key={qr.tableNumber} />
          ))}
        </Stack>
      </Container>
    </main>
  );
}
