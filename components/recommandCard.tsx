import { ID_MENU_CARD } from "@/constants";
import Image from "next/image";

interface Props {
  menuItemId: string;
  imagePath: string;
}

export default function RecommandCard({ menuItemId, imagePath }: Props) {
  const onClick = () => {
    const ele = document.getElementById(`${ID_MENU_CARD}_${menuItemId}`);
    ele?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      onClick={onClick}
      style={{
        maxWidth: "100px",
        maxHeight: "100px",
        borderRadius: "16px",
        overflow: "hidden",
        height: "fit-content",
        boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
        flexShrink: 0,
      }}
    >
      <Image
        src={`${process.env.BACKEND_URL}/${imagePath}`}
        alt="Next.js Logo"
        width={100}
        height={100}
        priority
      />
    </div>
  );
}
