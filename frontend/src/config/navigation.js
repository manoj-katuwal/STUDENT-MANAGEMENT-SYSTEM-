import {
  LayoutDashboard,
  Users,
  CreditCard,
  BarChart3,
  Wallet,
  Users2,
  GraduationCap,
  Layers3,
  CalendarDays,
  ReceiptText,
  Receipt,
} from "lucide-react";

export const NAV_ITEMS = [
  // Dashboard
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    group: null,
    allowedRoles: ["ADMIN", "ACCOUNTANT", "PRINCIPAL"],
  },

  // Administration
  {
    label: "Users",
    path: "/users",
    icon: Users,
    group: "Administration",
    allowedRoles: ["ADMIN"],
  },

  // Academic
  {
    label: "Students",
    path: "/students",
    icon: Users2,
    group: "Academic",
    allowedRoles: ["ADMIN", "ACCOUNTANT"],
  },
  {
    label: "Classes",
    path: "/classes",
    icon: GraduationCap,
    group: "Academic",
    allowedRoles: ["ADMIN"],
  },
  {
    label: "Sections",
    path: "/sections",
    icon: Layers3,
    group: "Academic",
    allowedRoles: ["ADMIN"],
  },
  {
    label: "Academic Years",
    path: "/academic-years",
    icon: CalendarDays,
    group: "Academic",
    allowedRoles: ["ADMIN"],
  },

  // Finance
  {
    label: "Fee Structures",
    path: "/fee-structures",
    icon: ReceiptText,
    group: "Finance",
    allowedRoles: ["ADMIN"],
  },
  {
    label: "Student Fees",
    path: "/student-fees",
    icon: Receipt,
    group: "Finance",
    allowedRoles: ["ADMIN", "ACCOUNTANT"],
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
    allowedRoles: ["ADMIN", "ACCOUNTANT", "PRINCIPAL"],
  },

  // Student
  {
    label: "My Fees",
    path: "/my-fees",
    icon: Wallet,
    group: null,
    allowedRoles: ["STUDENT"],
  },
];

export const getNavItemsForRole = (role) => {
  const normalizedRole = role?.trim().toUpperCase();

  if (!normalizedRole) return [];

  return NAV_ITEMS.filter((item) =>
    item.allowedRoles.includes(normalizedRole),
  );
};
