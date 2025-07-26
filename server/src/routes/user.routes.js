"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const user_controller_1 = require("../controllers/user.controller");
const router = (0, express_1.Router)();
// Semua rute di file ini akan diproteksi, hanya untuk pengguna yang sudah login
router.use(auth_middleware_1.protect);
// GET /api/user/me -> Mengambil profil sendiri
router.get('/me', user_controller_1.getMyProfile);
// PUT /api/user/me -> Memperbarui profil sendiri
router.put('/me', user_controller_1.updateMyProfile);
// POST /api/user/change-password -> Mengubah password
router.post('/change-password', user_controller_1.changePassword);
exports.default = router;
