import { CartItem, Order, OrderStatus, SummaryOrderHistory } from "@/types";

export async function getOrder(token: string): Promise<Order[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/order/pending`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: Order[] = (await res.json()) ?? [];

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
        menuItemId: cartItem.menuItemId,
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
  data
    .filter((order) => order.status !== OrderStatus.Decline)
    .forEach((order) => {
      const order_price = order.orderItems
        .filter((orderItem) => !orderItem.outOfStock)
        .reduce((accu, item) => accu + item.price * item.quantity, 0);
      total += order_price;
    });

  return {
    totalPrice: total,
    orderHistory: data ?? [],
  };
}

export async function updateOrderStatus(
  token: string,
  status: OrderStatus,
  orderId: string,
): Promise<void> {
  const res = await fetch(`${process.env.BACKEND_URL}/order/status/${orderId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: status,
    }),
  });

  if (res.status !== 200) {
    throw new Error();
  }
}
