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
exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const mailer_1 = require("../lib/mailer");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nama_lengkap, email, password } = req.body;
    if (!nama_lengkap || !email || !password) {
        return res.status(400).json({ message: "Semua field wajib diisi" });
    }
    try {
        const existingUser = yield prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: "Email sudah terdaftar" });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const newUser = yield prisma_1.default.user.create({
            data: {
                nama_lengkap,
                email,
                password: hashedPassword,
            },
        });
        res.status(201).json({
            message: "Registrasi berhasil!",
            userId: newUser.id
        });
    }
    catch (error) {
        console.error("Error saat registrasi:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // ... (kode untuk mencari user dan verifikasi password)
        const user = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Kredensial tidak valid" });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Kredensial tidak valid" });
        }
        // --- PERBAIKAN DI SINI ---
        // Ubah 'userId' menjadi 'id' agar konsisten
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role, nama_lengkap: user.nama_lengkap, // <-- Tambahkan ini
            email: user.email, }, // Ganti 'userId' menjadi 'id'
        process.env.JWT_SECRET, { expiresIn: "7d" });
        // --- AKHIR PERBAIKAN ---
        const { password: userPassword } = user, userInfo = __rest(user, ["password"]);
        res
            .cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 hari
        })
            .status(200)
            .json({ token, user: userInfo }); // Kirim token dan data user
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Gagal untuk login!" });
    }
});
exports.login = login;
// --- FUNGSI BARU: FORGOT PASSWORD ---
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        const user = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            // Respon yang sama untuk email terdaftar atau tidak untuk keamanan
            return res.status(200).json({ message: 'Jika email terdaftar, link reset password akan dikirimkan.' });
        }
        // Buat token
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
        const passwordResetToken = crypto_1.default
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        const passwordResetExpires = new Date(Date.now() + 3600000); // 1 jam
        yield prisma_1.default.user.update({
            where: { email },
            data: {
                resetPasswordToken: passwordResetToken,
                resetPasswordExpires: passwordResetExpires,
            },
        });
        // Kirim email
        const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`; // Ganti dengan URL frontend Anda
        const message = `Anda menerima email ini karena Anda (atau orang lain) meminta untuk mereset password akun Anda. Silakan klik link di bawah atau paste ke browser Anda untuk menyelesaikan prosesnya. Link akan kedaluwarsa dalam 1 jam.\n\n${resetURL}\n\nJika Anda tidak memintanya, abaikan email ini dan password Anda tidak akan berubah.`;
        yield (0, mailer_1.sendMail)({
            to: user.email,
            subject: 'Reset Password Akun HKI Portal',
            text: message,
            html: `<p>${message.replace(/\n/g, '<br>')}</p>`,
        });
        res.status(200).json({ message: 'Jika email terdaftar, link reset password akan dikirimkan.' });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        // Hapus token jika terjadi error
        yield prisma_1.default.user.update({
            where: { email },
            data: {
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });
        res.status(500).json({ message: 'Gagal mengirim email reset password.' });
    }
});
exports.forgotPassword = forgotPassword;
// --- FUNGSI BARU: RESET PASSWORD ---
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const hashedToken = crypto_1.default
            .createHash('sha256')
            .update(token)
            .digest('hex');
        const user = yield prisma_1.default.user.findFirst({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { gt: new Date() },
            },
        });
        if (!user) {
            return res.status(400).json({ message: 'Token tidak valid atau sudah kedaluwarsa.' });
        }
        if (!password || password.length < 8) {
            return res.status(400).json({ message: 'Password baru minimal 8 karakter.' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        yield prisma_1.default.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            },
        });
        res.status(200).json({ message: 'Password berhasil direset.' });
    }
    catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: 'Gagal mereset password.' });
    }
});
exports.resetPassword = resetPassword;
