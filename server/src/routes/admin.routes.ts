import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { protectAdmin } from '../middleware/admin.middleware';
import { upload } from '../middleware/upload.middleware'; // Impor middleware upload
import { 
    getAllPendaftaranForAdmin, 
    updatePendaftaranStatus,
    getPendaftaranDetailForAdmin, // Impor fungsi baru
    uploadSertifikat // Impor fungsi baru
} from '../controllers/admin.controller';

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

export default router;