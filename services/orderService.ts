import { CartItem, Order, SummaryOrderHistory } from "@/types";

export async function getOrder(token: string): Promise<Order[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/order/pending`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: Order[] = await res.json();

  console.log(data);

  return data;
}

export async function createOrder(token: string, cart: CartItem[]) {
  const res = await fetch(`${process.env.BACKEND_URL}/order`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderItems: cart.map((cartItem) => ({
        menuId: cartItem.menuItemId,
        quantity: cartItem.quantity,
      })),
    }),
  });

  if (res.status !== 200) {
    throw new Error();
  }
}

export async function getSummaryOrderHistory(token: string): Promise<SummaryOrderHistory> {
  const res = await fetch(`${process.env.BACKEND_URL}/client/order`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== 200) {
    throw new Error();
  }

  const data: Order[] = await res.json();

  let total = 0;
  data.forEach((order) => {
    const order_price = order.orderItems.reduce(
      (accu, item) => accu + item.price * item.quantity,
      0,
    );
    total += order_price;
  });

  return {
    totalPrice: total,
    orderHistory: data ?? [],
  };
}
