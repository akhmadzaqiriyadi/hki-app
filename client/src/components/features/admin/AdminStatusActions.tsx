"use client";

import React, { useState } from 'react';
import { useUpdateRegistrationStatus } from '@/queries/mutations/useUpdateRegistrationStatus';
import { StatusPendaftaran } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Send } from 'lucide-react';

interface AdminStatusActionsProps {
  pendaftaranId: string;
  currentStatus: StatusPendaftaran;
}

const statusOptions: StatusPendaftaran[] = ["submitted", "review", "revisi", "approved", "submitted_to_djki", "rejected"];

export function AdminStatusActions({ pendaftaranId, currentStatus }: AdminStatusActionsProps) {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [catatanRevisi, setCatatanRevisi] = useState('');
  const updateStatusMutation = useUpdateRegistrationStatus();

  const handleUpdate = () => {
    if (selectedStatus === 'revisi' && !catatanRevisi.trim()) {
        alert("Catatan revisi tidak boleh kosong!");
        return;
    }
    updateStatusMutation.mutate({ id: pendaftaranId, status: selectedStatus, catatan_revisi: catatanRevisi });
  };

  return (
    <Card className="border-blue-200/50 bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-slate-800">Tindakan Admin</CardTitle>
        <CardDescription className="text-base text-slate-600 font-medium">Ubah status pendaftaran atau minta revisi.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="status" className="font-semibold">Ubah Status Ke</Label>
            <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as StatusPendaftaran)}>
                <SelectTrigger id="status" className="border-blue-200/50 bg-white/80"><SelectValue /></SelectTrigger>
                <SelectContent>
                    {statusOptions.map(opt => <SelectItem key={opt} value={opt} className="capitalize">{opt.replace(/_/g, ' ')}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>

        {selectedStatus === 'revisi' && (
            <div className="space-y-2">
                <Label htmlFor="catatan" className="font-semibold">Catatan Revisi (Wajib diisi)</Label>
                <Textarea id="catatan" value={catatanRevisi} onChange={(e) => setCatatanRevisi(e.target.value)} placeholder="Contoh: Scan KTP buram, mohon unggah ulang." className="border-blue-200/50 bg-white/80"/>
            </div>
        )}

        <Button onClick={handleUpdate} disabled={updateStatusMutation.isPending} className="w-full bg-gradient-to-r from-blue-900 to-blue-800 hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl">
            {updateStatusMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
            Perbarui Status
        </Button>
      </CardContent>
    </Card>
  );
}