export interface Menu {
  catagory: string;
  items: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  catagory: string;
  description: string;
  price: number;
  outOfStock: boolean;
  imagePath: string;
  editable: boolean;
  limit: number;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
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
  createdAt: string;
  orderItems: OrderItem[];
  tableNumber: number;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  outOfStock: boolean;
  quantity: number;
  price: number;
  isComplete: boolean;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  editable: boolean;
  imagePath: string;
}

export interface QrCode {
  tableNumber: number;
  size: number;
  token: string;
  promotionId: string;
  promotionName: string;
  expire: Date;
  createdAt: string;
  createdBy: string;
}

export enum EmployeeRole {
  Default = -1,
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
  limit: number;
}

export enum PromotionMenuItemType {
  Buffet = 0,
  ALaCarte,
  None,
}

export interface Transaction {
  tableNumber: number;
  token: string;
  promotionName: string;
  size: number;
  remainingDuration: number;
  createdAt: string;
  totalPrice: number;
  startPrice: number;
  orderPrice: number;
  orderItems: OrderItem[];
}

export interface CreatePromotionRequest {
  name: string;
  price: number;
  imagePath: string;
  duration: number;
  description: string;
  promotionMenuItems: { type: PromotionMenuItemType; menuItemId: string; limit: number }[];
}

export interface UpdatePromotionRequest {
  name: string;
  price: number;
  imagePath: string;
  duration: number;
  description: string;
  promotionMenuItems: { type: PromotionMenuItemType; menuItemId: string; limit: number }[];
}

export interface CreateMenuRequest {
  name: string;
  catagory: string;
  description: string;
  outOfStock: boolean;
  price: number;
  imagePath: string;
}

export interface UpdateMenuRequest {
  name: string;
  catagory: string;
  description: string;
  price: number;
  imagePath: string;
}

export interface Employee {
  id: string;
  name: string;
  age: number;
  role: EmployeeRole;
  email: string;
  imagePath: string;
  createdAt: string;
  createdBy: string;
  editable: boolean;
}

export type EmployeeRoleName = "Admin" | "Chef" | "Waiter";

export interface CreateEmployeeRequest {
  name: string;
  age: number;
  role: EmployeeRole;
  imagePath: string;
  email: string;
}

export interface UpdateEmployeeRequest {
  name: string;
  age: number;
  role: EmployeeRole;
  imagePath: string;
  email: string;
}

export interface ErrorResponse {
  errMessage: string;
}

export interface UpdateOrderItemStatus {
  orderId: string;
  menuItemId: string;
  status: boolean;
}

export interface UpdateOrderItemStatusRequest {
  menuItemId: string;
  status: boolean;
}
