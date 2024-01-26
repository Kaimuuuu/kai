import { Box, Modal, Stack } from "@mui/material";
import Heading from "../typo/heading";
import TextField from "../textField";
import Button from "../button";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { Promotion } from "@/types";
import ModalStack from "../modalStack";
import useEmployeeToken from "@/hooks/useEmployeeToken";
import { generateQrCode } from "@/services/qrCodeService";

interface Props {
  promotion: Promotion;
  state: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export default function GenerateQrCodeModal({ promotion, state, onOpen, onClose }: Props) {
  const token = useEmployeeToken();

  const formik = useFormik({
    initialValues: {
      tableNumber: "",
      size: "",
    },
    onSubmit: async (values) => {
      onClose();
      generateQrCode(token, promotion.id, values.tableNumber, values.size)
        .then((token) => {
          formik.resetForm();
          Swal.fire({
            imageUrl: `${process.env.BACKEND_URL}/qrcode/${token}`,
            imageWidth: 300,
            imageHeight: 300,
            confirmButtonText: "ตกลง",
          });
        })
        .catch((err: Error) => {
          Swal.fire({
            title: "สร้าง QR Code ล้มเหลว",
            text: err.message,
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        });
    },
  });

  return (
    <Modal open={state} onClose={onClose}>
      <form onSubmit={formik.handleSubmit}>
        <ModalStack>
          <Heading>{`โปรโมชั่น: ${promotion.name}`}</Heading>
          <Stack spacing={"10px"} direction={"row"}>
            <TextField
              label="โต๊ะที่"
              name="tableNumber"
              onChange={formik.handleChange}
              type="number"
              required
              InputProps={{ inputProps: { min: 1 } }}
            />
            <TextField
              label="จำนวนคน"
              name="size"
              onChange={formik.handleChange}
              type="number"
              required
              InputProps={{ inputProps: { min: 1 } }}
            />
          </Stack>
          <Button label="สร้าง Qr Code" type="submit" />
          <Button label="ยกเลิก" myVariant="secondary" onClick={onClose} />
        </ModalStack>
      </form>
    </Modal>
  );
}
