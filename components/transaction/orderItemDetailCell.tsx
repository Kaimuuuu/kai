import { OrderItem } from "@/types";
import { IconButton, TableCell } from "@mui/material";
import { useState } from "react";
import TransactionOrderModal from "./transactionOrderModal";
import ReorderIcon from "@mui/icons-material/Reorder";

interface Props {
  orderItems: OrderItem[];
}

export default function OrderItemDetailCell({ orderItems }: Props) {
  const [modalState, setModalState] = useState<boolean>(false);

  const onOpenModal = () => setModalState(true);
  const onCloseModal = () => setModalState(false);

  return (
    <TableCell align="center">
      <IconButton onClick={onOpenModal} sx={{ margin: "auto" }}>
        <ReorderIcon fontSize="medium" />
      </IconButton>
      <TransactionOrderModal
        state={modalState}
        onOpen={onOpenModal}
        onClose={onCloseModal}
        orderItems={orderItems}
      />
    </TableCell>
  );
}
