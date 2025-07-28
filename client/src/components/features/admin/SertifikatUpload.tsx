"use client";

import React, { useState } from 'react';
import { useUploadSertifikat } from '@/queries/mutations/useUploadSertifikat';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, UploadCloud } from 'lucide-react';

export function SertifikatUpload({ pendaftaranId }: { pendaftaranId: string }) {
    const [file, setFile] = useState<File | null>(null);
    const uploadMutation = useUploadSertifikat();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!file) {
            alert("Silakan pilih file sertifikat terlebih dahulu.");
            return;
        }
        const formData = new FormData();
        formData.append('sertifikat_hki_url', file);
        uploadMutation.mutate({ id: pendaftaranId, formData });
    };

    return (
        <Card className="border-green-200/50 bg-gradient-to-br from-green-50/80 to-white backdrop-blur-sm shadow-xl">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-green-800">Unggah Sertifikat</CardTitle>
                <CardDescription className="text-base text-green-700 font-medium">Status akan otomatis berubah menjadi "Granted" setelah diunggah.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="sertifikat" className="font-semibold">File Sertifikat (PDF)</Label>
                    <Input id="sertifikat" type="file" accept=".pdf" onChange={handleFileChange} className="border-green-200/50 bg-white/80" />
                </div>
                <Button onClick={handleUpload} disabled={!file || uploadMutation.isPending} className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl">
                    {uploadMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                    Unggah dan Selesaikan
                </Button>
            </CardContent>
        </Card>
    );
}