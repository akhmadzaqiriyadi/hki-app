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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSertifikat = exports.updatePendaftaranStatus = exports.getPendaftaranDetailForAdmin = exports.getAllPendaftaranForAdmin = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
// Mengambil SEMUA pendaftaran yang perlu direview
const getAllPendaftaranForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendaftaran = yield prisma_1.default.pendaftaran.findMany({
            where: { NOT: { status: 'draft' } },
            include: { user: { select: { nama_lengkap: true, email: true } } },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(pendaftaran);
    }
    catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data pendaftaran' });
    }
});
exports.getAllPendaftaranForAdmin = getAllPendaftaranForAdmin;
// --- FUNGSI BARU: Mengambil DETAIL satu pendaftaran ---
const getPendaftaranDetailForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const pendaftaran = yield prisma_1.default.pendaftaran.findUnique({
            where: { id },
            include: {
                user: { select: { nama_lengkap: true, email: true } },
                pencipta: true,
            },
        });
        if (!pendaftaran) {
            return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
        }
        res.status(200).json(pendaftaran);
    }
    catch (error) {
        res.status(500).json({ message: 'Gagal mengambil detail pendaftaran' });
    }
});
exports.getPendaftaranDetailForAdmin = getPendaftaranDetailForAdmin;
// Memperbarui status pendaftaran (oleh Admin)
const updatePendaftaranStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status, catatan_revisi } = req.body;
    try {
        const updatedPendaftaran = yield prisma_1.default.pendaftaran.update({
            where: { id },
            data: {
                status: status,
                catatan_revisi: status === 'revisi' ? catatan_revisi : null,
            },
        });
        res.status(200).json({ message: 'Status berhasil diperbarui', pendaftaran: updatedPendaftaran });
    }
    catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui status' });
    }
});
exports.updatePendaftaranStatus = updatePendaftaranStatus;
// --- FUNGSI BARU: Mengunggah sertifikat dan mengubah status menjadi 'granted' ---
const uploadSertifikat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'File sertifikat tidak ditemukan.' });
    }
    try {
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${file.filename}`;
        const updatedPendaftaran = yield prisma_1.default.pendaftaran.update({
            where: { id },
            data: {
                sertifikat_hki_url: fileUrl,
                sertifikat_hki_filename: file.originalname,
                sertifikat_uploaded_at: new Date(),
                status: 'granted', // Langsung ubah status menjadi 'granted'
            },
        });
        res.status(200).json({ message: 'Sertifikat berhasil diunggah dan status diubah menjadi Granted.', pendaftaran: updatedPendaftaran });
    }
    catch (error) {
        res.status(500).json({ message: 'Gagal mengunggah sertifikat' });
    }
});
exports.uploadSertifikat = uploadSertifikat;
