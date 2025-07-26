"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const admin_middleware_1 = require("../middleware/admin.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware"); // Impor middleware upload
const admin_controller_1 = require("../controllers/admin.controller");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect, admin_middleware_1.protectAdmin);
// Rute yang sudah ada
router.get('/pendaftaran', admin_controller_1.getAllPendaftaranForAdmin);
router.put('/pendaftaran/:id/status', admin_controller_1.updatePendaftaranStatus);
// --- RUTE BARU ---
// GET /api/admin/pendaftaran/:id -> Mengambil detail satu pendaftaran
router.get('/pendaftaran/:id', admin_controller_1.getPendaftaranDetailForAdmin);
// POST /api/admin/pendaftaran/:id/sertifikat -> Mengunggah sertifikat
router.post('/pendaftaran/:id/sertifikat', upload_middleware_1.upload.single('sertifikat_hki_url'), // Menangani satu file dengan nama field 'sertifikat_hki_url'
admin_controller_1.uploadSertifikat);
exports.default = router;
