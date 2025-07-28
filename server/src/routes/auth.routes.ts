// server/src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login, forgotPassword, resetPassword } from '../controllers/auth.controller'; // <-- Impor fungsi login

const router = Router();

// Endpoint untuk registrasi
router.post('/register', register);

// --- ENDPOINT BARU UNTUK LOGIN ---
router.post('/login', login);

// --- ENDPOINT BARU UNTUK FORGOT & RESET PASSWORD ---
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

export default router;