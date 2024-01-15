import { Box, Modal, Stack } from "@mui/material";
import Heading from "../typo/heading";
import TextField from "../textField";
import Button from "../button";
import { useFormik } from "formik";
import { generateQrCode } from "@/services/promotionService";
import Swal from "sweetalert2";
import { Promotion } from "@/types";
import ModalStack from "../modalStack";
import useLocalStorage from "@/hooks/useLocalStorage";
import { LOCAL_STORAGE_EMPLOYEE_TOKEN } from "@/constants";

interface Props {
  promotion: Promotion;
  state: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function GenerateQrCodeModal({ promotion, state, onOpen, onClose }: Props) {
  const [token, setToken] = useLocalStorage(LOCAL_STORAGE_EMPLOYEE_TOKEN, "");

  const formik = useFormik({
    initialValues: {
      tableNumber: "",
      size: "",
    },
    onSubmit: async (values) => {
      onClose();
      generateQrCode(token, promotion.id, values.tableNumber, values.size)
        .then((token) => {
          Swal.fire({
            imageUrl: `${process.env.BACKEND_URL}/qrcode/${token}`,
            imageWidth: 300,
            imageHeight: 300,
            confirmButtonText: "ตกลง",
          });
        })
        .catch((err) => {
          Swal.fire({
            title: "สร้าง QR Code ไม่สำเร็จ",
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        });
    },
  });

  return (
    <Modal open={state} onClose={onClose}>
      <Box>
        <ModalStack>
          <Heading>{`โปรโมชั่น: ${promotion.name}`}</Heading>
          <Stack spacing={"10px"} direction={"row"}>
            <TextField label="โต๊ะที่" name="tableNumber" onChange={formik.handleChange} />
            <TextField label="จำนวนคน" name="size" onChange={formik.handleChange} />
          </Stack>
          <Button label="สร้าง Qr Code" onClick={formik.submitForm} />
          <Button label="ยกเลิก" myVariant="secondary" onClick={onClose} />
        </ModalStack>
      </Box>
    </Modal>
  );
}
