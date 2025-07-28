"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale";
import { useGetUsers, User } from "@/queries/queries/useGetUsers";
import { useDeleteUser } from "@/queries/mutations/useDeleteUser";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Loader2, AlertCircle, Users, PlusCircle, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { UserForm } from "@/components/features/admin/UserForm";
import { Badge } from "@/components/ui/badge";

export default function AdminUsersPage() {
  const { data: users, isLoading, isError, error } = useGetUsers();
  const deleteUser = useDeleteUser();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleAdd = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteUser.mutate(selectedUser.id, {
        onSuccess: () => {
          setIsConfirmOpen(false);
          setSelectedUser(null);
        },
      });
    }
  };

  return (
    <>
      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        defaultValues={selectedUser}
      />

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="border-red-200/50 bg-gradient-to-br from-red-50/80 to-white backdrop-blur-sm shadow-xl">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center shadow-lg">
                <Trash2 className="h-6 w-6 text-red-700" />
              </div>
              <AlertDialogTitle className="text-lg font-bold text-slate-800">
                Konfirmasi Penghapusan
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-slate-600 font-medium">
              Aksi ini akan menghapus pengguna "<span className="font-semibold text-slate-800">{selectedUser?.nama_lengkap}</span>" secara permanen. Data tidak bisa dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              disabled={deleteUser.isPending}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg"
            >
              {deleteUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {deleteUser.isPending ? 'Menghapus...' : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="relative min-h-screen">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 -right-20 w-96 h-96 bg-blue-800/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-40 -left-20 w-80 h-80 bg-blue-900/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>

        <div className="relative space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl items-center justify-center shadow-xl">
                <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-slate-700 bg-clip-text text-transparent">
                  Manajemen Pengguna
                </h1>
                <p className="text-base text-slate-600 font-medium">
                  Kelola, tambah, dan hapus data pengguna sistem.
                </p>
              </div>
            </div>
            <Button onClick={handleAdd} className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <PlusCircle className="mr-2 h-4 w-4" /> Tambah Pengguna
            </Button>
          </div>

          <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle>Daftar Pengguna</CardTitle>
              <CardDescription>Total {users?.length || 0} pengguna terdaftar.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>}
              {isError && <div className="text-center p-8 text-red-600"><AlertCircle className="mx-auto mb-2" /> {error.message}</div>}
              
              {!isLoading && !isError && (
                <div className="overflow-hidden rounded-xl border border-blue-200/30 bg-white/60">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-50/50 border-b-blue-200/50">
                        <TableHead className="font-semibold text-slate-700">Nama Lengkap</TableHead>
                        <TableHead className="font-semibold text-slate-700">Email</TableHead>
                        <TableHead className="font-semibold text-slate-700">Role</TableHead>
                        <TableHead className="font-semibold text-slate-700">Tanggal Bergabung</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user) => (
                        <TableRow key={user.id} className="hover:bg-blue-50/30">
                          <TableCell className="font-medium">{user.nama_lengkap}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'Admin' ? 'info' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(new Date(user.createdAt), 'dd MMMM yyyy', { locale: localeID })}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(user)}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDeleteClick(user)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                  <Trash2 className="mr-2 h-4 w-4" /> Hapus
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}