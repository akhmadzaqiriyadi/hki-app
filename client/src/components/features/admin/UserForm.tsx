"use client";

import React, { useEffect } from "react";
// --- PERBAIKAN 1: Tambahkan 'Controller' ke dalam import ---
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutateUser, UserFormValues } from "@/queries/mutations/useMutateUser";
import { User } from "@/queries/queries/useGetUsers";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Skema validasi

// Skema validasi
const userSchema = z.object({
  id: z.string().optional(),
  nama_lengkap: z.string().min(3, "Nama lengkap wajib diisi."),
  email: z.string().email("Email tidak valid."),
  password: z.string().optional(),
  role: z.enum(["User", "Admin"], {
    message: "Role wajib dipilih."
  }),
});

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  defaultValues?: User | null;
}

export function UserForm({ isOpen, onClose, defaultValues }: UserFormProps) {
  const isEditing = !!defaultValues;
  const mutateUser = useMutateUser();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (isOpen) {
      if (defaultValues) {
        reset({ ...defaultValues, password: "" }); // Kosongkan password saat edit
      } else {
        reset({ nama_lengkap: "", email: "", password: "", role: "User" });
      }
    }
  }, [isOpen, defaultValues, reset]);

  const onSubmit = (data: UserFormValues) => {
    mutateUser.mutate(data, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Pengguna" : "Tambah Pengguna Baru"}</DialogTitle>
          <DialogDescription>
            {isEditing ? `Mengubah data untuk ${defaultValues?.email}` : "Isi detail pengguna di bawah ini."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nama_lengkap" className="text-right">Nama</Label>
              <Input id="nama_lengkap" {...register("nama_lengkap")} className="col-span-3" />
              {errors.nama_lengkap && <p className="col-span-4 text-right text-xs text-red-600">{errors.nama_lengkap.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input id="email" type="email" {...register("email")} className="col-span-3" />
               {errors.email && <p className="col-span-4 text-right text-xs text-red-600">{errors.email.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">Password</Label>
              <Input id="password" type="password" {...register("password")} placeholder={isEditing ? "Isi jika ingin diubah" : ""} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">Role</Label>
              {/* Controller digunakan di sini */}
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="User">User</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
               {errors.role && <p className="col-span-4 text-right text-xs text-red-600">{errors.role.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit" disabled={mutateUser.isPending}>
              {mutateUser.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}