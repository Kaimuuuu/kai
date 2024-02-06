import { StatusCode } from "@/constants";
import {
  CartItem,
  ErrorResponse,
  Order,
  OrderStatus,
  SummaryOrderHistory,
  UpdateOrderItemStatus,
  UpdateOrderItemStatusRequest,
} from "@/types";

export async function getOrder(token: string): Promise<Order[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/order/pending`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== StatusCode.OK) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }

  const data: Order[] = (await res.json()) ?? [];

  return data;
}

export async function pollOrder(token: string, signal: AbortSignal): Promise<Order[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/order/pending/long-polling`, {
    method: "GET",
    signal: signal,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== StatusCode.OK) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }

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

  if (res.status !== StatusCode.CREATED) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }
}

export async function getSummaryOrderHistory(token: string): Promise<SummaryOrderHistory> {
  const res = await fetch(`${process.env.BACKEND_URL}/order/client`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== StatusCode.OK) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }

  let data: Order[] = (await res.json()) ?? [];

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

  if (res.status !== StatusCode.OK) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }
}

export async function updateOrderItemsStatus(
  token: string,
  updateOrderItemsStatus: UpdateOrderItemStatus[],
): Promise<void> {
  const col = new Map<string, UpdateOrderItemStatusRequest[]>();
  updateOrderItemsStatus.forEach((updateOrderItemsStatus) => {
    let req = col.get(updateOrderItemsStatus.orderId);
    if (req) {
      req = [
        ...req,
        {
          menuItemId: updateOrderItemsStatus.menuItemId,
          status: updateOrderItemsStatus.status,
        },
      ];
      col.set(updateOrderItemsStatus.orderId, req);
    } else {
      col.set(updateOrderItemsStatus.orderId, [
        {
          menuItemId: updateOrderItemsStatus.menuItemId,
          status: updateOrderItemsStatus.status,
        },
      ]);
    }
  });

  col.forEach(async (value: UpdateOrderItemStatusRequest[], orderId: string) => {
    const res = await fetch(`${process.env.BACKEND_URL}/order/status/${orderId}/items`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderItemsStatus: value,
      }),
    });

    if (res.status !== StatusCode.OK) {
      const err: ErrorResponse = await res.json();
      throw new Error(err.errMessage);
    }
  });
}
