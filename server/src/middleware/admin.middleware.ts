// server/src/middleware/admin.middleware.ts

import { Request, Response, NextFunction } from 'express';

export const protectAdmin = (req: Request, res: Response, next: NextFunction) => {
  // Periksa properti 'role' dari objek 'user' yang sudah ada di 'req'
  if (req.user?.role !== 'Admin') {
    return res.status(403).json({ message: 'Akses ditolak. Rute ini hanya untuk Admin.' });
  }
  
  // Jika role adalah Admin, lanjutkan
  next(); 
};