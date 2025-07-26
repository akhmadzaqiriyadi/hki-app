"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePassword, changePasswordSchema, ChangePasswordFormValues } from "@/queries/mutations/useChangePassword";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function ChangePasswordForm() {
  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });
  const changePasswordMutation = useChangePassword();

  const onSubmit = (data: ChangePasswordFormValues) => {
    changePasswordMutation.mutate(data, {
      onSuccess: () => reset(), // Reset form setelah berhasil
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Ubah Password</CardTitle>
          <CardDescription>Masukkan password Anda saat ini dan password baru.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Password Saat Ini</Label>
            <Input id="currentPassword" type="password" {...register("currentPassword")} />
            {errors.currentPassword && <p className="text-sm text-red-600 mt-1">{errors.currentPassword.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Password Baru</Label>
            <Input id="newPassword" type="password" {...register("newPassword")} />
            {errors.newPassword && <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button type="submit" disabled={!isDirty || changePasswordMutation.isPending}>
            {changePasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Simpan Password Baru
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}