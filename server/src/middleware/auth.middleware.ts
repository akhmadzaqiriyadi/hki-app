import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Tambahkan properti 'user' ke tipe Request Express
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; role: string };
    }
  }
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Akses ditolak, tidak ada token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string; role: string };
    req.user = decoded; // Simpan data user di object request
    next(); // Lanjutkan ke controller
  } catch (error) {
    return res.status(401).json({ message: 'Token tidak valid' });
  }
};