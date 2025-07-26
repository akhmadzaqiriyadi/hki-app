#!/bin/bash

echo "🚀 Mulai proses deploy ke VPS..."

ssh -i ~/vps -o StrictHostKeyChecking=no vps@192.168.254.200 << 'EOF'
  set -e
  echo "🔐 Terhubung ke VPS!"

  # Clone atau masuk ke folder
  if [ -d "/home/vps/hki-app/.git" ]; then
    cd /home/vps/hki-app
    echo "📥 Menarik update dari main..."
    git fetch origin main
    git reset --hard origin/main
  else
    echo "📥 Repo belum ada, cloning..."
    git clone https://github.com/akhmadzaqiriyadi/hki-app.git /home/vps/hki-app
    cd /home/vps/hki-app
  fi

  echo "📦 Memastikan file .env ada..."
  # Copy .env.example atau tambahkan .env jika belum ada
  if [ ! -f ".env" ]; then
    echo "DATABASE_URL=\"mysql://hkiapp:uchhkiapp24@@localhost:3306/hki_portal\"" > .env
    echo "JWT_SECRET=\"7b\$z@qG9!pW5rX8sL*vE#uY2hNfD(kM+J_cEaT3dGfHjKmNpQrStUvWxYz\"" >> .env
  fi

  echo "🛠 Deploy Backend..."
  cd server
  npm install

  # Export dotenv agar prisma bisa baca
  export $(grep -v '^#' ../.env | xargs)

  # Jalankan prisma migrate dan seed
  npx prisma migrate deploy

  if [ -f "prisma/seed.ts" ]; then
    npx prisma db seed
  fi

  npm run build

  pm2 restart hki-backend || pm2 start dist/index.js --name "hki-backend"

  echo "🛠 Deploy Frontend..."
  cd ../client
  npm install

  # Pastikan env frontend disiapkan juga
  if [ ! -f ".env.local" ]; then
  echo "NEXT_PUBLIC_API_URL=https://sentra-hki.uty.ac.id/api" > .env.local
    echo "NEXT_PUBLIC_BINDERBYTE_API_KEY=\"985762f00881a418fd3cae0f9d6dc0125b763ee476afa9b31e34aa7492a769f1\"" >> .env.local
  fi

  npm run build
  pm2 restart hki-frontend || pm2 start npm --name "hki-frontend" -- start

  echo "🎉 Selesai deploy!"
EOF