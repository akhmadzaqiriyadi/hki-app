"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import DashboardSidebar from "./DashboardSidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardHeader() {
  const { user, logout, isLoading } = useAuth(); // Ambil juga status isLoading
  
  // Buat inisial dari nama lengkap untuk fallback avatar
  const initials = user?.nama_lengkap
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-4 lg:h-[60px] lg:px-6 sticky top-0 z-30">
      {/* Tombol Menu Mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Buka menu navigasi</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="flex flex-col p-0">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>

      <div className="w-full flex-1">
        {/* Bisa diisi dengan breadcrumbs atau judul halaman nanti */}
      </div>

      {/* Dropdown Profil Pengguna */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar>
              {/* <AvatarImage src="URL_FOTO_PROFIL_JIKA_ADA" /> */}
              <AvatarFallback className="bg-blue-800 text-white font-semibold">
                {isLoading ? '...' : initials}
              </AvatarFallback>
            </Avatar>
            <span className="sr-only">Buka menu pengguna</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.nama_lengkap}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()} className="text-red-600 focus:text-red-700">
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}