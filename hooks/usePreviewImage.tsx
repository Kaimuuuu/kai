import { Dispatch, SetStateAction, useState } from "react";

export default function usePreviewImage(): [
  File | undefined,
  Dispatch<SetStateAction<File | undefined>>,
  string,
] {
  const [imageFile, setImageFile] = useState<File>();

  let previewUrl = "";
  if (imageFile) {
    previewUrl = URL.createObjectURL(imageFile);
  }

  return [imageFile, setImageFile, previewUrl];
}
