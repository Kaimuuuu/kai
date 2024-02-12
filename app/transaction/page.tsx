"use client";

import Navbar from "@/components/layout/navbar";
import OrderItemDetailCell from "@/components/transaction/orderItemDetailCell";
import Body from "@/components/typo/body";
import Title from "@/components/typo/title";
import useEmployeeToken from "@/hooks/useEmployeeToken";
import { me } from "@/services/authService";
import { getTransactions } from "@/services/transactionService";
import { Transaction } from "@/types";
import {
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Transaction() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const token = useEmployeeToken();

  useEffect(() => {
    if (token && isLoading) {
      me(token).catch((err) => {
        router.push("/login");
      });
    }
  }, [token, isLoading]);

  useEffect(() => {
    if (token) {
      getTransactions(token)
        .then((transactions) => {
          setTransactions(transactions);
          setIsLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [token]);

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
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Title>Token</Title>
                  </TableCell>
                  <TableCell align="right">
                    <Title>#โต๊ะ</Title>
                  </TableCell>
                  <TableCell align="right">
                    <Title>จำนวนคน</Title>
                  </TableCell>
                  <TableCell align="right">
                    <Title>โปรโมชั่น</Title>
                  </TableCell>
                  <TableCell align="right">
                    <Title>ราคารวม</Title>
                  </TableCell>
                  <TableCell align="right">
                    <Title>คำสั่งอาหาร</Title>
                  </TableCell>
                  <TableCell align="right">
                    <Title>เข้าร้านเมื่อ</Title>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow
                    key={transaction.token}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      <Body>{transaction.token}</Body>
                    </TableCell>
                    <TableCell align="right">
                      <Body>{transaction.tableNumber}</Body>
                    </TableCell>
                    <TableCell align="right">
                      <Body>{transaction.size}</Body>
                    </TableCell>
                    <TableCell align="right">
                      <Body>{transaction.promotionName}</Body>
                    </TableCell>
                    <TableCell align="right">
                      <Body>{`${transaction.totalPrice} บาท`}</Body>
                    </TableCell>
                    <OrderItemDetailCell orderItems={transaction.orderItems} />
                    <TableCell align="right">
                      <Body>{transaction.createdAt}</Body>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Container>
    </main>
  );
}
