import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Memulai proses seeding...');

  // 1. Buat Pengguna Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@uty.ac.id' },
    update: {},
    create: {
      email: 'admin@uty.ac.id',
      nama_lengkap: 'Admin HKI',
      password: adminPassword,
      role: 'Admin',
    },
  });
  console.log(`✅ Pengguna Admin dibuat/diperbarui: ${admin.email}`);

  // 2. Buat Pengguna Biasa (User)
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@uty.ac.id' },
    update: {},
    create: {
      email: 'user@uty.ac.id',
      nama_lengkap: 'User Biasa',
      password: userPassword,
      role: 'User',
    },
  });
  console.log(`✅ Pengguna User dibuat/diperbarui: ${user.email}`);

  console.log('Seeding selesai.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });