import { DashboardConfig } from "types"

export const dashboardConfig: DashboardConfig = {
  mainNav: [
    {
      title: "Pricing",
      href: "/pricing",
    },
    {
      title: "Features",
      href: "/features",
      disabled: true,
    },
  ],
  sidebarNav: [
    {
      title: "Videos",
      href: "/dashboard",
      icon: "video",
    },
    {
      title: "Billing",
      href: "/dashboard/billing",
      icon: "billing",
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: "settings",
    },
  ],
}
