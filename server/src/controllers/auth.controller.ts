import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
  const { nama_lengkap, email, password } = req.body;

  if (!nama_lengkap || !email || !password) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        nama_lengkap,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ 
        message: "Registrasi berhasil!",
        userId: newUser.id 
    });
  } catch (error) {
    console.error("Error saat registrasi:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi" });
  }
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    // --- PERBAIKAN DI SINI ---
    // Sekarang kita masukkan semua data yang dibutuhkan frontend ke dalam payload token
    const tokenPayload = {
        userId: user.id,
        role: user.role,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET as string,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: "Login berhasil!",
      token,
      user: {
        id: user.id,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error("Error saat login:", error);
    res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};