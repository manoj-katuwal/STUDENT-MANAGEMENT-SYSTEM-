import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Wallet,
} from "lucide-react";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    group: null,
    allowedRoles: ["ADMIN", "ACCOUNTANT", "PRINCIPAL", "STUDENT"],
  },

  {
    label: "Users",
    path: "/users",
    icon: Users,
    group: "Administration",
    allowedRoles: ["ADMIN"],
  },

  {
    label: "Payments",
    path: "/payments",
    icon: CreditCard,
    group: "Finance",
    allowedRoles: ["ADMIN", "ACCOUNTANT"],
  },

  {
    label: "Reports",
    path: "/reports",
    icon: BarChart3,
    group: "Finance",
    allowedRoles: ["ADMIN", "PRINCIPAL"],
  },

  {
    label: "My Fees",
    path: "/my-fees",
    icon: Wallet,
    group: null,
    allowedRoles: ["STUDENT"],
  },
];

export const getNavItemsForRole = (role) => {
  if (!role) return [];

  return NAV_ITEMS.filter((item) => item.allowedRoles.includes(role));
};
