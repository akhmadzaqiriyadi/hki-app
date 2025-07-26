"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalizePendaftaran = exports.submitPaymentProof = exports.getProtectedFile = exports.deletePendaftaran = exports.updatePendaftaran = exports.getPendaftaranById = exports.getMyPendaftaran = exports.createDraftPendaftaran = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const path_1 = __importDefault(require("path")); // <-- Tambahkan impor 'path'
const fs_1 = __importDefault(require("fs"));
// ... (fungsi createDraftPendaftaran, getMyPendaftaran, getPendaftaranById tidak berubah)
const createDraftPendaftaran = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    if (!userId) {
        return res.status(401).json({ message: 'Otentikasi diperlukan' });
    }
    try {
        const newDraft = yield prisma_1.default.pendaftaran.create({
            data: {
                userId: userId,
                judul: 'Draf Baru Tanpa Judul',
                jenis_pemilik: 'Umum',
                status: 'draft',
            },
        });
        res.status(201).json(newDraft);
    }
    catch (error) {
        res.status(500).json({ message: 'Gagal membuat draf pendaftaran' });
    }
});
exports.createDraftPendaftaran = createDraftPendaftaran;
const getMyPendaftaran = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const pendaftaran = yield prisma_1.default.pendaftaran.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(pendaftaran);
    }
    catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data pendaftaran' });
    }
});
exports.getMyPendaftaran = getMyPendaftaran;
const getPendaftaranById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const pendaftaran = yield prisma_1.default.pendaftaran.findUnique({
            where: { id },
            include: { pencipta: true },
        });
        if (!pendaftaran || pendaftaran.userId !== userId) {
            return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
        }
        res.status(200).json(pendaftaran);
    }
    catch (error) {
        res.status(500).json({ message: 'Gagal mengambil detail pendaftaran' });
    }
});
exports.getPendaftaranById = getPendaftaranById;
// --- PERBAIKAN UTAMA DI FUNGSI INI ---
const updatePendaftaran = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const _b = req.body, { pencipta: penciptaJson } = _b, formData = __rest(_b, ["pencipta"]);
    const files = req.files;
    try {
        const existingPendaftaran = yield prisma_1.default.pendaftaran.findFirst({
            where: { id, userId }
        });
        if (!existingPendaftaran) {
            return res.status(404).json({ message: 'Pendaftaran tidak ditemukan atau Anda tidak memiliki akses.' });
        }
        // 1. Ambil semua data dari body, KECUALI yang tidak boleh diubah
        const { id: bodyId, userId: bodyUserId, createdAt, updatedAt } = formData, safeFormData = __rest(formData, ["id", "userId", "createdAt", "updatedAt"]);
        const pendaftaranData = Object.assign({}, safeFormData);
        // 2. Konversi dan bersihkan data
        if (pendaftaranData.tanggal_diumumkan) {
            pendaftaranData.tanggal_diumumkan = new Date(pendaftaranData.tanggal_diumumkan);
        }
        // Perbaiki masalah status array: jika status adalah array, ambil elemen terakhir
        if (Array.isArray(pendaftaranData.status)) {
            pendaftaranData.status = pendaftaranData.status.pop();
        }
        Object.keys(pendaftaranData).forEach(key => {
            if (pendaftaranData[key] === '' || pendaftaranData[key] === 'undefined' || pendaftaranData[key] === 'null') {
                pendaftaranData[key] = null;
            }
        });
        // 3. Tambahkan URL file yang diunggah
        if (files) {
            for (const key in files) {
                const file = files[key][0];
                const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
                pendaftaranData[key] = fileUrl;
            }
        }
        const penciptaData = penciptaJson ? JSON.parse(penciptaJson) : [];
        const transaction = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            yield tx.pencipta.deleteMany({ where: { pendaftaranId: id } });
            if (penciptaData && penciptaData.length > 0) {
                yield tx.pencipta.createMany({
                    data: penciptaData.map((p) => {
                        const { id: penciptaId, pendaftaranId } = p, rest = __rest(p, ["id", "pendaftaranId"]);
                        return Object.assign(Object.assign({}, rest), { pendaftaranId: id });
                    }),
                });
            }
            const updatedPendaftaran = yield tx.pendaftaran.update({
                where: { id },
                data: pendaftaranData,
                include: { pencipta: true }
            });
            return updatedPendaftaran;
        }));
        res.status(200).json(transaction);
    }
    catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: 'Gagal memperbarui pendaftaran' });
    }
});
exports.updatePendaftaran = updatePendaftaran;
// --- FUNGSI BARU UNTUK MENGHAPUS PENDAFTARAN ---
const deletePendaftaran = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        // 1. Cari draf pendaftaran berdasarkan ID dan ID pengguna
        const draft = yield prisma_1.default.pendaftaran.findFirst({
            where: {
                id: id,
                userId: userId,
            },
        });
        // 2. Jika tidak ditemukan, kirim error 404
        if (!draft) {
            return res.status(404).json({ message: 'Draf pendaftaran tidak ditemukan atau Anda tidak memiliki akses.' });
        }
        // 3. Hanya izinkan penghapusan jika statusnya adalah 'draft'
        if (draft.status !== 'draft') {
            return res.status(403).json({ message: 'Hanya pendaftaran dengan status draf yang bisa dihapus.' });
        }
        // 4. Jika semua validasi lolos, hapus pendaftaran
        yield prisma_1.default.pendaftaran.delete({
            where: { id: id },
        });
        res.status(200).json({ message: 'Draf pendaftaran berhasil dihapus.' });
    }
    catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: 'Gagal menghapus pendaftaran' });
    }
});
exports.deletePendaftaran = deletePendaftaran;
// --- FUNGSI BARU UNTUK MENGAMBIL FILE SECARA AMAN ---
const getProtectedFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { filename } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const pendaftaran = yield prisma_1.default.pendaftaran.findFirst({
            where: {
                userId: userId,
                OR: [
                    { lampiran_karya_url: { contains: filename } },
                    { surat_pernyataan_url: { contains: filename } },
                    { scan_ktp_kolektif_url: { contains: filename } },
                    { surat_pengalihan_url: { contains: filename } },
                    { bukti_transfer_url: { contains: filename } },
                    { sertifikat_hki_url: { contains: filename } },
                ],
            },
        });
        if (!pendaftaran) {
            return res.status(404).json({ message: 'File tidak ditemukan atau Anda tidak memiliki akses.' });
        }
        // --- PERBAIKAN DI SINI ---
        // Gunakan path.resolve agar konsisten dengan middleware upload
        const filePath = path_1.default.resolve(process.cwd(), 'public/uploads', filename);
        if (fs_1.default.existsSync(filePath)) {
            res.sendFile(filePath);
        }
        else {
            return res.status(404).json({ message: 'File tidak ditemukan di server.' });
        }
    }
    catch (error) {
        console.error("Get file error:", error);
        res.status(500).json({ message: 'Gagal mengambil file' });
    }
});
exports.getProtectedFile = getProtectedFile;
const submitPaymentProof = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const file = req.file; // File diakses dari req.file karena kita akan pakai upload.single()
    if (!file) {
        return res.status(400).json({ message: 'File bukti pembayaran tidak ditemukan.' });
    }
    try {
        // 1. Cek apakah pendaftaran ini milik pengguna dan statusnya 'approved'
        const pendaftaran = yield prisma_1.default.pendaftaran.findFirst({
            where: { id: id, userId: userId },
        });
        if (!pendaftaran) {
            return res.status(404).json({ message: 'Pendaftaran tidak ditemukan atau Anda tidak memiliki akses.' });
        }
        if (pendaftaran.status !== 'approved') {
            return res.status(403).json({ message: 'Pembayaran hanya bisa dilakukan untuk pendaftaran yang sudah disetujui.' });
        }
        // 2. Buat URL publik untuk file yang diunggah
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        // 3. Update pendaftaran dengan URL bukti bayar dan ubah statusnya ke 'review'
        const updatedPendaftaran = yield prisma_1.default.pendaftaran.update({
            where: { id: id },
            data: {
                bukti_transfer_url: fileUrl,
                status: 'review', // Status kembali ke 'review' untuk verifikasi admin
            },
        });
        res.status(200).json({ message: 'Bukti pembayaran berhasil diunggah.', pendaftaran: updatedPendaftaran });
    }
    catch (error) {
        console.error("Submit payment error:", error);
        res.status(500).json({ message: 'Gagal memproses pembayaran' });
    }
});
exports.submitPaymentProof = submitPaymentProof;
// --- FUNGSI BARU UNTUK FINALISASI ---
const finalizePendaftaran = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const draft = yield prisma_1.default.pendaftaran.findFirst({
            where: { id, userId, status: 'draft' },
        });
        if (!draft) {
            return res.status(404).json({ message: 'Draf tidak ditemukan atau Anda tidak memiliki akses.' });
        }
        const updatedPendaftaran = yield prisma_1.default.pendaftaran.update({
            where: { id },
            data: { status: 'submitted' },
        });
        res.status(200).json({ message: 'Pendaftaran berhasil difinalisasi.', pendaftaran: updatedPendaftaran });
    }
    catch (error) {
        res.status(500).json({ message: 'Gagal memfinalisasi pendaftaran.' });
    }
});
exports.finalizePendaftaran = finalizePendaftaran;
