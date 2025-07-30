"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Wallet } from "lucide-react";
import { usePendaftaranFee } from "@/hooks/usePendaftaranFee";
import { useSubmitPaymentProof } from "@/queries/mutations/useSubmitPaymentProof";

interface PaymentUploadFormProps {
  pendaftaranId: string;
  jenisPemilik: string;
  jenisKarya: string;
}

const paymentSchema = z.object({
  bukti_transfer: z.any().refine((files) => files?.length === 1, "File bukti transfer wajib diunggah."),
});

type PaymentFormValues = z.infer<typeof paymentSchema>;

export default function PaymentUploadForm({ pendaftaranId, jenisPemilik, jenisKarya }: PaymentUploadFormProps) {
  const biaya = usePendaftaranFee(jenisPemilik, jenisKarya);
  const { register, handleSubmit, formState: { errors } } = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentSchema),
  });
  const paymentMutation = useSubmitPaymentProof();

  const onSubmit = (data: PaymentFormValues) => {
    const formData = new FormData();
    formData.append("bukti_transfer_url", data.bukti_transfer[0]);
    paymentMutation.mutate({ pendaftaranId, formData });
  };

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800"><Wallet className="h-5 w-5" />Tindakan Diperlukan: Pembayaran</CardTitle>
        <CardDescription>Pendaftaran Anda telah disetujui. Silakan lakukan pembayaran untuk melanjutkan proses.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-white rounded-lg border">
          <p className="text-sm text-muted-foreground">Total Tagihan:</p>
          <p className="text-2xl font-bold">Rp {biaya.toLocaleString('id-ID')},-</p>
          <div className="mt-4 pt-4 border-t text-sm">
            <p className="font-semibold">Silakan transfer ke:</p>
            <p>E-Wallet: <span className="font-mono font-semibold">DANA</span></p>
            <p>Atas Nama: <span className="font-mono font-semibold">SINDHI KHARISMA</span></p>
            <p>Nomor: <span className="font-mono font-semibold">[082336623249]</span></p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="bukti_transfer" className="font-semibold">Unggah Bukti Pembayaran (JPG, PNG, PDF)</Label>
            <Input id="bukti_transfer" type="file" {...register("bukti_transfer")} className="mt-1" accept=".jpg,.jpeg,.png,.pdf" />
            {errors.bukti_transfer && <p className="text-xs text-red-600 mt-1">{errors.bukti_transfer.message as string}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={paymentMutation.isPending}>
            {paymentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Kirim Bukti Pembayaran
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}