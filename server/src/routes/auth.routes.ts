// server/src/routes/auth.routes.ts
import { Router } from 'express';
import { register, login } from '../controllers/auth.controller'; // <-- Impor fungsi login

const router = Router();

// Endpoint untuk registrasi
router.post('/register', register);

// --- ENDPOINT BARU UNTUK LOGIN ---
router.post('/login', login);

export default router;