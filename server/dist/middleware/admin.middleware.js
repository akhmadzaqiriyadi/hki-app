"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.protectAdmin = void 0;
// Middleware ini harus digunakan SETELAH middleware 'protect'
const protectAdmin = (req, res, next) => {
    var _a;
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== 'Admin') {
        return res.status(403).json({ message: 'Akses ditolak. Rute ini hanya untuk Admin.' });
    }
    next(); // Jika role adalah Admin, lanjutkan
};
exports.protectAdmin = protectAdmin;
