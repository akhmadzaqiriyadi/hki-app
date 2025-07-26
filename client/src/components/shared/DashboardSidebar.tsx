"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Files, BarChart3, Users, Settings,  } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const userNavLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/pendaftaran", label: "Pendaftaran HKI", icon: Files, exact: false },
  { href: "/dashboard/settings", label: "Pengaturan Akun", icon: Settings, exact: true },
];

const adminNavLinks = [
  { href: "/admin/dashboard", label: "Dashboard Admin", icon: LayoutDashboard, exact: true },
  { href: "/admin/pendaftaran", label: "Verifikasi HKI", icon: Files, exact: false },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, exact: true },
  { href: "/admin/users", label: "Manajemen Pengguna", icon: Users, exact: true },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navLinks = user?.role === 'Admin' ? adminNavLinks : userNavLinks;
  const homeLink = user?.role === 'Admin' ? '/admin/dashboard' : '/dashboard';

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="text-lg bg-gradient-to-r from-blue-900 to-blue-800 bg-clip-text text-transparent">
            Portal HKI UTY
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
          {navLinks.map((link) => {
            const isActive = link.exact
              ? pathname === link.href
              : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-slate-700 transition-all hover:bg-slate-100",
                  isActive && "bg-slate-200 text-slate-900"
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}