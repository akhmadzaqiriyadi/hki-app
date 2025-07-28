"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/routes/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller"); // <-- Impor fungsi login
const router = (0, express_1.Router)();
// Endpoint untuk registrasi
router.post('/register', auth_controller_1.register);
// --- ENDPOINT BARU UNTUK LOGIN ---
router.post('/login', auth_controller_1.login);
// --- ENDPOINT BARU UNTUK FORGOT & RESET PASSWORD ---
router.post('/forgot-password', auth_controller_1.forgotPassword);
router.put('/reset-password/:token', auth_controller_1.resetPassword);
exports.default = router;
