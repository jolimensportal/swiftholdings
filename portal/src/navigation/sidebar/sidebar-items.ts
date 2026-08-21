import {
  Building2,
  Calendar,
  ChartBar,
  FolderOpen,
  Gauge,
  LayoutDashboard,
  Lock,
  type LucideIcon,
  ReceiptText,
  Users,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Portfolio",
    items: [
      {
        id: "dashboard",
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        id: "portfolio",
        title: "Portfolio",
        url: "/portfolio",
        icon: ChartBar,
      },
      {
        id: "default",
        title: "Overview",
        url: "/dashboard/default",
        icon: Gauge,
      },
    ],
  },
  {
    id: 2,
    label: "Investments",
    items: [
      {
        id: "prefabs",
        title: "Prefabs",
        url: "/prefabs",
        icon: Building2,
      },
      {
        id: "statements",
        title: "Statements",
        url: "/statements",
        icon: ReceiptText,
      },
    ],
  },
  {
    id: 3,
    label: "Documents",
    items: [
      {
        id: "documents",
        title: "Documents",
        url: "/documents",
        icon: FolderOpen,
      },
      {
        id: "briefings",
        title: "Briefings",
        url: "/briefings",
        icon: Calendar,
      },
    ],
  },
  {
    id: 4,
    label: "Members",
    items: [
      {
        id: "users",
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
      },
      {
        id: "roles",
        title: "Roles",
        url: "/dashboard/roles",
        icon: Lock,
      },
    ],
  },
];
