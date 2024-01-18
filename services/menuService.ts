import { StatusCode } from "@/constants";
import {
  CreateMenuRequest,
  EmployeeRole,
  ErrorResponse,
  Menu,
  MenuItem,
  UpdateMenuRequest,
} from "@/types";

export async function getMenu(token: string): Promise<Menu[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/menu`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const menuItems: MenuItem[] = await res.json();

  return menuItemsToMenuList(menuItems);
}

export async function getEditMenu(token: string, role: EmployeeRole): Promise<Menu[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/menu/edit`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  let menuItems: MenuItem[] = await res.json();
  if (role === EmployeeRole.Admin) {
    menuItems = menuItems.map((menuItem) => ({
      ...menuItem,
      editable: true,
    }));
  }

  return menuItemsToMenuList(menuItems);
}

export async function getAllMenu(token: string): Promise<Menu[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/menu/edit`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  let menuItems: MenuItem[] = await res.json();

  return menuItemsToMenuList(menuItems);
}

export async function toggleOutOfStock(
  token: string,
  menuId: string,
  isOutOfStock: boolean,
): Promise<void> {
  const res = await fetch(`${process.env.BACKEND_URL}/menu/${menuId}/out-of-stock`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "Application/json",
    },
    body: JSON.stringify({
      isOutOfStock: isOutOfStock,
    }),
  });

  if (res.status !== StatusCode.OK) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }
}

export async function getRecommand(token: string): Promise<MenuItem[]> {
  const res = await fetch(`${process.env.BACKEND_URL}/menu/recommand`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data: MenuItem[] = await res.json();

  return data;
}

export async function createMenu(token: string, req: CreateMenuRequest): Promise<void> {
  const res = await fetch(`${process.env.BACKEND_URL}/menu`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(req),
  });

  if (res.status !== StatusCode.CREATED) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }
}

export async function updateMenu(
  token: string,
  req: UpdateMenuRequest,
  menuId: string,
): Promise<void> {
  const res = await fetch(`${process.env.BACKEND_URL}/menu/${menuId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(req),
  });

  if (res.status !== StatusCode.OK) {
    const err: ErrorResponse = await res.json();
    throw new Error(err.errMessage);
  }
}

export async function deleteMenu(token: string, menuId: string): Promise<void> {
  const res = await fetch(`${process.env.BACKEND_URL}/menu/${menuId}`, {
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

function menuItemsToMenuList(menuItems: MenuItem[]): Menu[] {
  let menuMap = new Map<string, MenuItem[]>();
  menuItems.map((menuItem) => {
    if (!menuMap.has(menuItem.catagory)) {
      menuMap.set(menuItem.catagory, [menuItem]);
    } else {
      const menuItems = menuMap.get(menuItem.catagory);
      if (menuItems === undefined) {
        throw new Error();
      }
      menuItems.push(menuItem);
    }
  });

  let menu: Menu[] = [];
  menuMap.forEach((value: MenuItem[], key: string) => {
    menu.push({
      catagory: key,
      items: value,
    });
  });

  return menu;
}
