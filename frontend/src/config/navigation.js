

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: null, // TODO: assign icon component/name later
    group: null,
    allowedRoles: ["ADMIN", "ACCOUNTANT", "PRINCIPAL", "STUDENT"],
  },
  {
    label: "Users",
    path: "/users",
    icon: null,
    group: "Administration",
    allowedRoles: ["ADMIN"],
  },
  {
    label: "Payments",
    path: "/payments",
    icon: null,
    group: "Finance",
    allowedRoles: ["ADMIN", "ACCOUNTANT"],
  },
  {
    label: "Reports",
    path: "/reports",
    icon: null,
    group: "Finance",
    allowedRoles: ["ADMIN", "PRINCIPAL"],
  },
  {
    label: "My Fees",
    path: "/my-fees",
    icon: null,
    group: null,
    allowedRoles: ["STUDENT"],
  },
];


export const getNavItemsForRole = (role) => {
  if (!role) return [];
  return NAV_ITEMS.filter((item) => item.allowedRoles.includes(role));
};
