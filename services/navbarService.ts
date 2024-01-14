import { EmployeeRole, NavItem } from "@/types";

export function getNavbar(role: EmployeeRole): NavItem[] {
  switch (role) {
    case EmployeeRole.Admin: {
      return [
        {
          name: "ดูเมนูอาหารทั้งหมด",
          path: "/edit",
        },
        {
          name: "ดูรายการโปรโมชั่น",
          path: "/promotion",
        },
        {
          name: "ดูรายการคำสั่งอาหาร",
          path: "/order",
        },
        {
          name: "ดู Qr Code ทั้งหมด",
          path: "/qrcode",
        },
        {
          name: "ดูข้อมูลพนักงาน",
          path: "/employee",
        },
      ];
    }
    case EmployeeRole.Chef: {
      return [
        {
          name: "ดูเมนูอาหารทั้งหมด",
          path: "/edit",
        },
        {
          name: "ดูรายการคำสั่งอาหาร",
          path: "/order",
        },
      ];
    }
    case EmployeeRole.Waiter: {
      return [
        {
          name: "ดูเมนูอาหารทั้งหมด",
          path: "/edit",
        },
        {
          name: "ดูรายการโปรโมชั่น",
          path: "/promotion",
        },
        {
          name: "ดูรายการคำสั่งอาหาร",
          path: "/order",
        },
        {
          name: "ดู Qr Code ทั้งหมด",
          path: "/qrcode",
        },
      ];
    }
    default: {
      return [];
    }
  }
}
