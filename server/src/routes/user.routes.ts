import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { changePassword, getMyProfile, updateMyProfile } from '../controllers/user.controller';

const router = Router();

// Semua rute di file ini akan diproteksi, hanya untuk pengguna yang sudah login
router.use(protect);

// GET /api/user/me -> Mengambil profil sendiri
router.get('/me', getMyProfile);

// PUT /api/user/me -> Memperbarui profil sendiri
router.put('/me', updateMyProfile);

// POST /api/user/change-password -> Mengubah password
router.post('/change-password', changePassword);    

export default router;