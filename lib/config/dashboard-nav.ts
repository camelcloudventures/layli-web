export type NavItem = {
  title: string;
  href: string;
  icon: string;
};

export const dashboardNavItems = {
  top: [
    {
      title: "Home",
      href: "/dashboard",
      icon: "home",
    },
    {
      title: "Audit Templates",
      href: "/dashboard/templates",
      icon: "fileText",
    },
    {
      title: "Schedules",
      href: "/dashboard/schedules",
      icon: "calendar",
    },
    {
      title: "Issues",
      href: "/dashboard/issues",
      icon: "alertTriangle",
    },
    {
      title: "Actions",
      href: "/dashboard/actions",
      icon: "checkSquare",
    },
    {
      title: "Inspections",
      href: "/dashboard/inspections",
      icon: "search",
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      icon: "barChart3",
    },
  ],
  middle: [],
  bottom: [
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
};
