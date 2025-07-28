import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { protectAdmin } from '../middleware/admin.middleware';
import { 
    getAllPendaftaranForAdmin, 
    updatePendaftaranStatus,
    getPendaftaranDetailForAdmin, // Impor fungsi baru
    uploadSertifikat, // Impor fungsi baru
} from '../controllers/admin.controller';

import { 
    getAllUsers, 
    createUser, 
    getUserById, 
    updateUser, 
    deleteUser 
} from '../controllers/user.controller';

const router = Router();

router.use(protect, protectAdmin);


// Rute yang sudah ada
router.get('/pendaftaran', getAllPendaftaranForAdmin);
router.put('/pendaftaran/:id/status', updatePendaftaranStatus);

// --- RUTE BARU ---
// GET /api/admin/pendaftaran/:id -> Mengambil detail satu pendaftaran
router.get('/pendaftaran/:id', getPendaftaranDetailForAdmin);

// POST /api/admin/pendaftaran/:id/sertifikat -> Mengunggah sertifikat
router.post(
    '/pendaftaran/:id/sertifikat',
    upload.single('sertifikat_hki_url'), // Menangani satu file dengan nama field 'sertifikat_hki_url'
    uploadSertifikat
);

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);


export default router;