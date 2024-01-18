import { StatusCode } from "@/constants";
import { ErrorResponse } from "@/types";

export async function uploadImage(token: string, image: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", image);

  const res = await fetch(`${process.env.BACKEND_URL}/image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (res.status !== StatusCode.CREATED) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }

  const data: { imagePath: string } = await res.json();

  return data.imagePath;
}
