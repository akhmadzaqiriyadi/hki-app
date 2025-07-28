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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getUserById = exports.getAllUsers = exports.changePassword = exports.updateMyProfile = exports.getMyProfile = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Impor 'UserRole' dihapus karena tidak diperlukan dan menyebabkan error
// Mengambil profil pengguna yang sedang login
const getMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Ambil ID pengguna dari token yang sudah diverifikasi oleh middleware
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    // Penambahan: Validasi jika userId tidak ada (sebagai pengaman tambahan)
    if (!userId) {
        return res.status(401).json({ message: 'Akses ditolak, pengguna tidak terautentikasi.' });
    }
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id: userId },
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
        console.error("Error getting my profile:", error);
        res.status(500).json({ message: 'Gagal mengambil profil' });
    }
});
exports.getMyProfile = getMyProfile;
// Memperbarui profil pengguna yang sedang login
const updateMyProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { nama_lengkap } = req.body;
    if (!userId) {
        return res.status(401).json({ message: 'Akses ditolak, pengguna tidak terautentikasi.' });
    }
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
        console.error("Error updating my profile:", error);
        res.status(500).json({ message: 'Gagal memperbarui profil' });
    }
});
exports.updateMyProfile = updateMyProfile;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { currentPassword, newPassword } = req.body;
    if (!userId) {
        return res.status(401).json({ message: 'Akses ditolak, pengguna tidak terautentikasi.' });
    }
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Password lama dan baru wajib diisi.' });
    }
    if (newPassword.length < 8) {
        return res.status(400).json({ message: 'Password baru minimal 8 karakter.' });
    }
    try {
        const user = yield prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Password lama Anda salah.' });
        }
        const hashedNewPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        yield prisma_1.default.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        res.status(200).json({ message: 'Password berhasil diperbarui.' });
    }
    catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ message: 'Gagal memperbarui password.' });
    }
});
exports.changePassword = changePassword;
// Fungsi utilitas untuk menghapus field password dari objek user
const excludePassword = (user) => {
    const { password } = user, data = __rest(user, ["password"]);
    return data;
};
// [Admin] Mendapatkan semua pengguna
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.default.user.findMany({
            select: {
                id: true,
                nama_lengkap: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error getting all users:", error);
        res.status(500).json({ message: 'Gagal mendapatkan data pengguna.' });
    }
});
exports.getAllUsers = getAllUsers;
// [Admin] Mendapatkan satu pengguna berdasarkan ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const user = yield prisma_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                nama_lengkap: true,
                email: true,
                role: true,
                createdAt: true,
            }
        });
        if (!user) {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Error getting user by id:", error);
        res.status(500).json({ message: 'Gagal mendapatkan data pengguna.' });
    }
});
exports.getUserById = getUserById;
// [Admin] Membuat pengguna baru
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nama_lengkap, email, password, role } = req.body;
    if (!nama_lengkap || !email || !password) {
        return res.status(400).json({ message: 'Nama lengkap, email, dan password harus diisi.' });
    }
    try {
        const existingUser = yield prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email sudah terdaftar.' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield prisma_1.default.user.create({
            data: {
                nama_lengkap,
                email,
                password: hashedPassword,
                // PERBAIKAN: Gunakan string literal yang cocok dengan enum di skema
                role: role === 'Admin' ? 'Admin' : 'User',
            },
        });
        res.status(201).json({ message: 'Pengguna berhasil dibuat.', user: excludePassword(newUser) });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ message: 'Gagal membuat pengguna baru.' });
    }
});
exports.createUser = createUser;
// [Admin] Memperbarui data pengguna
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nama_lengkap, email, password, role } = req.body;
    try {
        if (email) {
            const existingUser = yield prisma_1.default.user.findFirst({
                where: {
                    email: email,
                    id: { not: id },
                },
            });
            if (existingUser) {
                return res.status(409).json({ message: 'Email baru sudah digunakan oleh pengguna lain.' });
            }
        }
        const dataToUpdate = {};
        if (nama_lengkap)
            dataToUpdate.nama_lengkap = nama_lengkap;
        if (email)
            dataToUpdate.email = email;
        if (role)
            dataToUpdate.role = role;
        // PERBAIKAN: Hanya hash dan update password jika field password diisi (tidak kosong)
        if (password && password.length > 0) {
            dataToUpdate.password = yield bcryptjs_1.default.hash(password, 10);
        }
        const updatedUser = yield prisma_1.default.user.update({
            where: { id },
            data: dataToUpdate,
        });
        res.status(200).json({ message: 'Data pengguna berhasil diperbarui.', user: excludePassword(updatedUser) });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: 'Gagal memperbarui data pengguna.' });
    }
});
exports.updateUser = updateUser;
// [Admin] Menghapus pengguna
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield prisma_1.default.user.delete({
            where: { id },
        });
        res.status(200).json({ message: 'Pengguna berhasil dihapus.' });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Pengguna tidak ditemukan.' });
        }
        res.status(500).json({ message: 'Gagal menghapus pengguna.' });
    }
});
exports.deleteUser = deleteUser;
