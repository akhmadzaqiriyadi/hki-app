import { Router } from 'express';
import { 
    createDraftPendaftaran, 
    getMyPendaftaran,
    getPendaftaranById,
    updatePendaftaran,
    deletePendaftaran,
    getProtectedFile,
    submitPaymentProof,
    finalizePendaftaran,
} from '../controllers/pendaftaran.controller';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

// Semua rute di file ini akan diproteksi oleh middleware 'protect'
router.use(protect);

// GET /api/pendaftaran -> Mengambil semua pendaftaran pengguna
router.get('/', getMyPendaftaran);

// POST /api/pendaftaran -> Membuat draf pendaftaran baru
router.post('/', createDraftPendaftaran);

// GET /api/pendaftaran/:id -> Mengambil detail satu pendaftaran
router.get('/:id', getPendaftaranById);

// PUT /api/pendaftaran/:id -> Memperbarui pendaftaran
// Middleware 'upload.fields' akan menangani file-file yang diunggah
router.put('/:id', upload.fields([
    { name: 'lampiran_karya_url', maxCount: 1 },
    { name: 'surat_pernyataan_url', maxCount: 1 },
    { name: 'scan_ktp_kolektif_url', maxCount: 1 },
    { name: 'surat_pengalihan_url', maxCount: 1 },
    { name: 'bukti_transfer_url', maxCount: 1 },
]), updatePendaftaran);

router.delete('/:id', deletePendaftaran);

router.get('/file/:filename', getProtectedFile);

// --- RUTE BARU UNTUK SUBMIT PEMBAYARAN ---
router.post(
    '/:id/submit-payment', 
    upload.single('bukti_transfer_url'), // Middleware untuk menangani 1 file dengan nama field 'bukti_transfer_url'
    submitPaymentProof
);

// --- RUTE BARU UNTUK FINALIZE PENDAFTARAN ---
router.post('/:id/finalize', finalizePendaftaran);

export default router;