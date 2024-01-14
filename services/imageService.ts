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

  if (res.status !== 200) {
    throw new Error();
  }

  const data: { imagePath: string } = await res.json();

  return data.imagePath;
}
