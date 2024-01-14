import { Box, Stack, Card as MuiCard } from "@mui/material";
import Heading from "../typo/heading";
import Button from "../button";
import Card from "../card";
import { Order } from "@/types";
import Title from "../typo/title";
import Body from "../typo/body";

interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  return (
    <MuiCard sx={{ borderRadius: "16px", width: "100%" }}>
      <Stack sx={{ padding: "10px" }} spacing="10px">
        <Stack direction={"row"} alignItems={"center"}>
          <Heading>{`#${order.id}`}</Heading>
          <Box marginLeft={"auto"}>
            <Body bold>{`${order.createdAt}`}</Body>
          </Box>
        </Stack>
        <Stack padding={1} bgcolor={"#E6E6E5"} borderRadius={"10px"} spacing={"10px"}>
          {order.orderItems.map((item) => (
            <Stack direction={"row"} key={item.name}>
              <Title>{item.name}</Title>
              <Stack direction={"row"} marginLeft={"auto"} spacing={"4px"}>
                {item.outOfStock && <Card label={`หมด`} bgcolor="#000000" />}
                <Card label={`x${item.quantity}`} />
              </Stack>
            </Stack>
          ))}
        </Stack>
        <Body bold>{`โต๊ะที่: ${order.tableNumber}`}</Body>
        <Button label="สำเร็จ" />
        <Button label="ยกเลิก" myVariant="error" />
      </Stack>
    </MuiCard>
  );
}
