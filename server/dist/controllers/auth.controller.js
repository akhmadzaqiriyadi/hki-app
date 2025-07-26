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
exports.login = exports.register = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
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
    if (!email || !password) {
        return res.status(400).json({ message: "Email dan password wajib diisi" });
    }
    try {
        const user = yield prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Email atau password salah" });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Email atau password salah" });
        }
        // --- PERBAIKAN DI SINI ---
        // Sekarang kita masukkan semua data yang dibutuhkan frontend ke dalam payload token
        const tokenPayload = {
            userId: user.id,
            role: user.role,
            nama_lengkap: user.nama_lengkap,
            email: user.email,
        };
        const token = jsonwebtoken_1.default.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({
            message: "Login berhasil!",
            token,
            user: {
                id: user.id,
                nama_lengkap: user.nama_lengkap,
                email: user.email,
                role: user.role,
            }
        });
    }
    catch (error) {
        console.error("Error saat login:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server" });
    }
});
exports.login = login;
