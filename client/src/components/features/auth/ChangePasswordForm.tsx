"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePassword, changePasswordSchema, ChangePasswordFormValues } from "@/queries/mutations/useChangePassword";
import { CardContent, CardFooter } from "@/components/ui/card";
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
      onSuccess: () => reset(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Card dan CardHeader dihapus dari sini */}
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currentPassword">Password Saat Ini</Label>
          <Input id="currentPassword" type="password" {...register("currentPassword")} className="border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm" />
          {errors.currentPassword && <p className="text-sm text-red-600 mt-1">{errors.currentPassword.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="newPassword">Password Baru</Label>
          <Input id="newPassword" type="password" {...register("newPassword")} className="border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20 bg-white/80 backdrop-blur-sm" />
          {errors.newPassword && <p className="text-sm text-red-600 mt-1">{errors.newPassword.message}</p>}
        </div>
      </CardContent>
      <CardFooter>
        <Button type="submit" disabled={!isDirty || changePasswordMutation.isPending} className="bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 mt-4">
          {changePasswordMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Simpan Password Baru
        </Button>
      </CardFooter>
    </form>
  );
}