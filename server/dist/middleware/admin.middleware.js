"use strict";
// server/src/middleware/admin.middleware.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectAdmin = void 0;
const protectAdmin = (req, res, next) => {
    var _a;
    // Periksa properti 'role' dari objek 'user' yang sudah ada di 'req'
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'Admin') {
        return res.status(403).json({ message: 'Akses ditolak. Rute ini hanya untuk Admin.' });
    }
    // Jika role adalah Admin, lanjutkan
    next();
};
exports.protectAdmin = protectAdmin;
