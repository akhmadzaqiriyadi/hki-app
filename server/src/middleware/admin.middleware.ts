import { Request, Response, NextFunction } from 'express';

// Middleware ini harus digunakan SETELAH middleware 'protect'
export const protectAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'Admin') {
    return res.status(403).json({ message: 'Akses ditolak. Rute ini hanya untuk Admin.' });
  }
  next(); // Jika role adalah Admin, lanjutkan
};