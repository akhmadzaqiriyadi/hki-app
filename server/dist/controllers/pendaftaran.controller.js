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
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const createDraftPendaftaran = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // PERBAIKAN: Gunakan 'id' bukan 'userId'
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        return res.status(401).json({ message: 'Otentikasi diperlukan' });
    }
    try {
        const newDraft = yield prisma_1.default.pendaftaran.create({
            data: {
                userId: userId,
                judul: 'Draf Baru Tanpa Judul',
                jenis_pemilik: 'Umum', // Default value
                status: 'draft',
            },
        });
        res.status(201).json(newDraft);
    }
    catch (error) {
        console.error("Create draft error:", error);
        res.status(500).json({ message: 'Gagal membuat draf pendaftaran' });
    }
});
exports.createDraftPendaftaran = createDraftPendaftaran;
const getMyPendaftaran = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // PERBAIKAN: Gunakan 'id' bukan 'userId'
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const pendaftaran = yield prisma_1.default.pendaftaran.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json(pendaftaran);
    }
    catch (error) {
        console.error("Get my pendaftaran error:", error);
        res.status(500).json({ message: 'Gagal mengambil data pendaftaran' });
    }
});
exports.getMyPendaftaran = getMyPendaftaran;
const getPendaftaranById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    // PERBAIKAN: Gunakan 'id' bukan 'userId'
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const pendaftaran = yield prisma_1.default.pendaftaran.findUnique({
            where: { id },
            include: { pencipta: true, user: { select: { nama_lengkap: true, email: true } } },
        });
        // Hanya user pemilik atau admin yang bisa melihat detail
        if (!pendaftaran || (pendaftaran.userId !== userId && ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'Admin')) {
            return res.status(404).json({ message: 'Pendaftaran tidak ditemukan' });
        }
        res.status(200).json(pendaftaran);
    }
    catch (error) {
        console.error("Get pendaftaran by id error:", error);
        res.status(500).json({ message: 'Gagal mengambil detail pendaftaran' });
    }
});
exports.getPendaftaranById = getPendaftaranById;
const updatePendaftaran = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    // PERBAIKAN: Gunakan 'id' bukan 'userId'
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const _b = req.body, { pencipta: penciptaJson } = _b, formData = __rest(_b, ["pencipta"]);
    const files = req.files;
    try {
        const existingPendaftaran = yield prisma_1.default.pendaftaran.findFirst({
            where: { id, userId }
        });
        if (!existingPendaftaran) {
            return res.status(404).json({ message: 'Pendaftaran tidak ditemukan atau Anda tidak memiliki akses.' });
        }
        const { id: bodyId, userId: bodyUserId, createdAt, updatedAt } = formData, safeFormData = __rest(formData, ["id", "userId", "createdAt", "updatedAt"]);
        const pendaftaranData = Object.assign({}, safeFormData);
        if (pendaftaranData.tanggal_diumumkan) {
            pendaftaranData.tanggal_diumumkan = new Date(pendaftaranData.tanggal_diumumkan);
        }
        if (Array.isArray(pendaftaranData.status)) {
            pendaftaranData.status = pendaftaranData.status.pop();
        }
        Object.keys(pendaftaranData).forEach(key => {
            if (pendaftaranData[key] === '' || pendaftaranData[key] === 'undefined' || pendaftaranData[key] === 'null') {
                pendaftaranData[key] = null;
            }
        });
        if (files) {
            for (const key in files) {
                const file = files[key][0];
                pendaftaranData[key] = `/uploads/${file.filename}`; // Simpan path relatif
            }
        }
        const penciptaData = penciptaJson ? JSON.parse(penciptaJson) : [];
        // --- PERBAIKAN: Tambahkan tipe 'Prisma.TransactionClient' pada 'tx' ---
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
const deletePendaftaran = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    // PERBAIKAN: Gunakan 'id' bukan 'userId'
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const draft = yield prisma_1.default.pendaftaran.findFirst({
            where: { id: id, userId: userId },
        });
        if (!draft) {
            return res.status(404).json({ message: 'Draf pendaftaran tidak ditemukan atau Anda tidak memiliki akses.' });
        }
        if (draft.status !== 'draft') {
            return res.status(403).json({ message: 'Hanya pendaftaran dengan status draf yang bisa dihapus.' });
        }
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
const getProtectedFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { filename } = req.params;
    // PERBAIKAN: Gunakan 'id' bukan 'userId'
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    try {
        const whereClause = {
            OR: [
                { lampiran_karya_url: { contains: filename } },
                { surat_pernyataan_url: { contains: filename } },
                { scan_ktp_kolektif_url: { contains: filename } },
                { surat_pengalihan_url: { contains: filename } },
                { bukti_transfer_url: { contains: filename } },
                { sertifikat_hki_url: { contains: filename } },
            ],
        };
        // Jika bukan admin, batasi hanya untuk file milik sendiri
        if (((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'Admin') {
            whereClause.userId = userId;
        }
        const pendaftaran = yield prisma_1.default.pendaftaran.findFirst({ where: whereClause });
        if (!pendaftaran) {
            return res.status(404).json({ message: 'File tidak ditemukan atau Anda tidak memiliki akses.' });
        }
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
    // PERBAIKAN: Gunakan 'id' bukan 'userId'
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'File bukti pembayaran tidak ditemukan.' });
    }
    try {
        const pendaftaran = yield prisma_1.default.pendaftaran.findFirst({
            where: { id: id, userId: userId },
        });
        if (!pendaftaran) {
            return res.status(404).json({ message: 'Pendaftaran tidak ditemukan atau Anda tidak memiliki akses.' });
        }
        if (pendaftaran.status !== 'approved') {
            return res.status(403).json({ message: 'Pembayaran hanya bisa dilakukan untuk pendaftaran yang sudah disetujui.' });
        }
        const fileUrl = `/uploads/${file.filename}`;
        const updatedPendaftaran = yield prisma_1.default.pendaftaran.update({
            where: { id: id },
            data: {
                bukti_transfer_url: fileUrl,
                status: 'review',
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
const finalizePendaftaran = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    // PERBAIKAN: Gunakan 'id' bukan 'userId'
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
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
        console.error("Finalize error:", error);
        res.status(500).json({ message: 'Gagal memfinalisasi pendaftaran.' });
    }
});
exports.finalizePendaftaran = finalizePendaftaran;
