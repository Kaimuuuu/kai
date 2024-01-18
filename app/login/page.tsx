"use client";

import Button from "@/components/button";
import TextField from "@/components/textField";
import { login } from "@/services/authService";
import { Container, Stack } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Login() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      login(values.email, values.password)
        .then(() => {
          router.push("/edit");
        })
        .catch((err: Error) => {
          Swal.fire({
            title: "เกิดข้อผิดพลาด!",
            text: err.message,
            icon: "error",
            confirmButtonText: "ตกลง",
          });
        });
    },
  });

  return (
    <main
      style={{
        backgroundColor: "#FAFAFA",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container>
        <form onSubmit={formik.handleSubmit}>
          <Stack spacing={"10px"}>
            <TextField
              label="Email"
              name="email"
              type="text"
              required
              onChange={formik.handleChange}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              required
              onChange={formik.handleChange}
            />
            <Button label="Login" type="submit" />
          </Stack>
        </form>
      </Container>
    </main>
  );
}
