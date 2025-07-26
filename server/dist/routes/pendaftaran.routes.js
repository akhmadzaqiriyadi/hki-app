"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pendaftaran_controller_1 = require("../controllers/pendaftaran.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const router = (0, express_1.Router)();
// Semua rute di file ini akan diproteksi oleh middleware 'protect'
router.use(auth_middleware_1.protect);
// GET /api/pendaftaran -> Mengambil semua pendaftaran pengguna
router.get('/', pendaftaran_controller_1.getMyPendaftaran);
// POST /api/pendaftaran -> Membuat draf pendaftaran baru
router.post('/', pendaftaran_controller_1.createDraftPendaftaran);
// GET /api/pendaftaran/:id -> Mengambil detail satu pendaftaran
router.get('/:id', pendaftaran_controller_1.getPendaftaranById);
// PUT /api/pendaftaran/:id -> Memperbarui pendaftaran
// Middleware 'upload.fields' akan menangani file-file yang diunggah
router.put('/:id', upload_middleware_1.upload.fields([
    { name: 'lampiran_karya_url', maxCount: 1 },
    { name: 'surat_pernyataan_url', maxCount: 1 },
    { name: 'scan_ktp_kolektif_url', maxCount: 1 },
    { name: 'surat_pengalihan_url', maxCount: 1 },
    { name: 'bukti_transfer_url', maxCount: 1 },
]), pendaftaran_controller_1.updatePendaftaran);
router.delete('/:id', pendaftaran_controller_1.deletePendaftaran);
router.get('/file/:filename', pendaftaran_controller_1.getProtectedFile);
// --- RUTE BARU UNTUK SUBMIT PEMBAYARAN ---
router.post('/:id/submit-payment', upload_middleware_1.upload.single('bukti_transfer_url'), // Middleware untuk menangani 1 file dengan nama field 'bukti_transfer_url'
pendaftaran_controller_1.submitPaymentProof);
// --- RUTE BARU UNTUK FINALIZE PENDAFTARAN ---
router.post('/:id/finalize', pendaftaran_controller_1.finalizePendaftaran);
exports.default = router;
