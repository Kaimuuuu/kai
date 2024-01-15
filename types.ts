export interface Menu {
  catagory: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  catagory: string;
  weight: number;
  description: string;
  price: number;
  outOfStock: boolean;
  imagePath: string;
  editable: boolean;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  weight: number;
}

export interface SummaryOrderHistory {
  totalPrice: number;
  orderHistory: Order[];
}

export enum OrderStatus {
  Pending = 0,
  Success,
  Decline,
}

export interface Order {
  id: string;
  status: OrderStatus;
  createdAt: Date;
  orderItems: OrderItem[];
  tableNumber: number;
}

export interface OrderItem {
  name: string;
  outOfStock: boolean;
  quantity: number;
  price: number;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  weight: number;
  duration: number;
  price: number;
  editable: boolean;
  imagePath: string;
  menuItemIdList: string[];
}

export interface QrCode {
  tableNumber: number;
  size: number;
  token: string;
  promotionId: string;
  promotionName: string;
  expire: Date;
  createdAt: Date;
  createdBy: string;
}

export enum EmployeeRole {
  Admin = 0,
  Chef,
  Waiter,
}

export interface NavItem {
  name: string;
  path: string;
}

export interface PromotionMenuItem {
  type: PromotionMenuItemType;
  menuItem: MenuItem;
}

export enum PromotionMenuItemType {
  Buffet = 0,
  ALaCarte,
  None,
}

export interface CheckoutSummaryObject {
  tableNumber: number;
  promotionName: string;
  size: number;
  remainingDuration: number;
  createdAt: Date;
  totalPrice: number;
  orderItems: OrderItem[];
}

export interface CreatePromotionRequest {
  name: string;
  weight: number;
  price: number;
  imagePath: string;
  duration: number;
  description: string;
  promotionMenuItems: { type: PromotionMenuItemType; menuItemId: string }[];
}

export interface CreateMenuRequest {
  name: string;
  catagory: string;
  weight: number;
  description: string;
  outOfStock: boolean;
  price: number;
  imagePath: string;
}

export interface UpdateMenuRequest {
  name: string;
  catagory: string;
  weight: number;
  description: string;
  price: number;
  imagePath: string;
}
