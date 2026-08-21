import {
  Banknote,
  BadgeCheck,
  Boxes,
  Calendar,
  ChartBar,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Megaphone,
  Settings,
  Users,
  type LucideIcon,
  Wallet,
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
    label: "Owner",
    items: [
      { id: "dashboard", title: "Dashboard", url: "/dashboard/default", icon: LayoutDashboard },
      { id: "portfolio", title: "Portfolio", url: "/portfolio", icon: ChartBar },
      { id: "marketplace", title: "Marketplace", url: "/marketplace", icon: Wallet },
      { id: "tenants", title: "Tenants", url: "/tenants", icon: Users },
    ],
  },
  {
    id: 2,
    label: "Resources",
    items: [
      { id: "documents", title: "Documents", url: "/documents", icon: FolderOpen },
      { id: "briefings", title: "Briefings", url: "/briefings", icon: Calendar },
    ],
  },
  {
    id: 3,
    label: "Account",
    items: [{ id: "profile", title: "Profile", url: "/profile", icon: FileText }],
  },
  {
    id: 4,
    label: "Super Admin",
    items: [
      { id: "admin-members", title: "Members", url: "/admin/members", icon: Users },
      { id: "admin-capsules", title: "Capsules", url: "/admin/capsules", icon: Boxes },
      { id: "admin-payouts", title: "Payouts", url: "/admin/payouts", icon: Banknote },
      { id: "admin-kyc", title: "KYC Review", url: "/admin/kyc", icon: BadgeCheck },
      { id: "admin-content", title: "Content", url: "/admin/content", icon: Megaphone },
      { id: "admin-settings", title: "Settings", url: "/admin/settings", icon: Settings },
    ],
  },
];
