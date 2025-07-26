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
exports.changePassword = exports.updateMyProfile = exports.getMyProfile = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Mengambil profil pengguna yang sedang login
const getMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: userId },
            // Pilih field yang aman untuk dikirim ke frontend
            select: {
                id: true,
                nama_lengkap: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Gagal mengambil profil' });
    }
});
exports.getMyProfile = getMyProfile;
// Memperbarui profil pengguna yang sedang login
const updateMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { nama_lengkap } = req.body;
    if (!nama_lengkap) {
        return res.status(400).json({ message: 'Nama lengkap tidak boleh kosong' });
    }
    try {
        const updatedUser = yield prisma_1.default.user.update({
            where: { id: userId },
            data: {
                nama_lengkap: nama_lengkap,
            },
            select: {
                id: true,
                nama_lengkap: true,
                email: true,
                role: true,
            },
        });
        res.status(200).json({ message: 'Profil berhasil diperbarui', user: updatedUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui profil' });
    }
});
exports.updateMyProfile = updateMyProfile;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const { currentPassword, newPassword } = req.body;
    // 1. Validasi input
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Password lama dan baru wajib diisi.' });
    }
    if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Password baru minimal 8 karakter.' });
    }
    try {
        // 2. Ambil data pengguna, termasuk password-nya
        const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        // 3. Verifikasi password saat ini
        const isPasswordValid = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password lama Anda salah.' });
        }
        // 4. Hash password baru dan update ke database
        const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        yield prisma_1.default.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        res.status(200).json({ message: 'Password berhasil diperbarui.' });
    }
    catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui password.' });
    }
});
exports.changePassword = changePassword;
