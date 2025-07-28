// server/src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Definisikan tipe payload dari token Anda
interface TokenPayload {
  id: string; // Pastikan nama propertinya 'id', bukan 'userId'
  role: string;
}

// Tambahkan properti 'user' ke tipe Request Express
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak, token tidak tersedia atau format salah' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifikasi token dan pastikan tipenya adalah TokenPayload
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
    
    // Simpan seluruh payload yang sudah didekode ke req.user
    req.user = decoded; 
    
    next(); // Lanjutkan ke middleware atau controller berikutnya
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa' });
  }
};