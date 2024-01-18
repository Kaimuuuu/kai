import {
  CreatePromotionRequest,
  EmployeeRole,
  ErrorResponse,
  MenuItem,
  Promotion,
  PromotionMenuItem,
  PromotionMenuItemType,
  UpdatePromotionRequest,
} from "@/types";
import { getAllMenu } from "./menuService";
import { StatusCode } from "@/constants";

export async function getPromotions(token: string, role: EmployeeRole) {
  const res = await fetch(`${process.env.BACKEND_URL}/promotion`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const promotions: Promotion[] = (await res.json()) ?? [];

  return promotions.map((promotion) => ({
    ...promotion,
    editable: role === EmployeeRole.Admin ? true : false,
  }));
}

export async function generateQrCode(
  token: string,
  promotionId: string,
  tableNumber: string,
  size: string,
) {
  const res = await fetch(`${process.env.BACKEND_URL}/client`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      promotionId: promotionId,
      tableNumber: Number(tableNumber),
      size: Number(size),
    }),
  });

  if (res.status !== StatusCode.CREATED) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }

  const data: { clientToken: string } = await res.json();

  return data.clientToken;
}

export async function getAllPromotionMenuItems(token: string): Promise<PromotionMenuItem[]> {
  const menus = await getAllMenu(token);
  const menuItems = menus.flatMap((menu) => menu.items);

  return menuItems.map((menuItem) => ({
    type: PromotionMenuItemType.None,
    menuItem: menuItem,
  }));
}

export async function getPromotionMenuItems(
  token: string,
  promotionId: string,
): Promise<PromotionMenuItem[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/promotion/${promotionId}/menu`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const promotionMenuItems: PromotionMenuItem[] = await res.json();

  const allPromotionMenuItems: PromotionMenuItem[] = await getAllPromotionMenuItems(token);

  return allPromotionMenuItems.map((promotionMenuItem) => {
    const target = promotionMenuItems.find(
      (target) => target.menuItem.id === promotionMenuItem.menuItem.id,
    );
    let type = promotionMenuItem.type;
    if (target) {
      type = target.type;
    }

    return {
      menuItem: promotionMenuItem.menuItem,
      type: type,
    };
  });
}

export async function createPromotion(token: string, req: CreatePromotionRequest): Promise<void> {
  const res = await fetch(`${process.env.BACKEND_URL}/promotion`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });

  if (res.status !== StatusCode.CREATED) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }
}

export async function updatePromotion(
  token: string,
  req: UpdatePromotionRequest,
  promotionId: string,
): Promise<void> {
  const res = await fetch(`${process.env.BACKEND_URL}/promotion/${promotionId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  });

  if (res.status !== StatusCode.OK) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }
}

export async function deletePromotion(token: string, promotionId: string): Promise<void> {
  const res = await fetch(`${process.env.BACKEND_URL}/promotion/${promotionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.status !== StatusCode.OK) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }
}

export async function getWeight(token: string): Promise<number> {
  const res = await fetch(`${process.env.BACKEND_URL}/promotion/weight`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: { weight: number } = await res.json();

  return data.weight;
}
