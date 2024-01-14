import { DEFALUT_IMAGE_PATH } from "@/constants";
import Image from "next/image";

interface Props {
  imagePath?: string
  width?: number
  height?: number
  frontend?: boolean
}

export default function MyImage({ imagePath, width, height, frontend }: Props) {

  return (
    <Image
        src={imagePath 
          ? frontend 
            ? imagePath 
            : `${process.env.BACKEND_URL}/${imagePath}` 
          : DEFALUT_IMAGE_PATH}
        alt="Next.js Logo"
        width={width ? width : 130}
        height={height ? height : 130}
        priority
      />
  )
}