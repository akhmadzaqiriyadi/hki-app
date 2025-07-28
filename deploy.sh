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

  # --- PERBAIKAN 1: Pindahkan semua .env ke direktori masing-masing ---

  echo "🛠 Deploy Backend..."
  cd server

  echo "📦 Membuat file .env untuk server..."
  # Buat .env untuk server dengan SEMUA environment variables
  cat > .env << 'ENV_EOF'
DATABASE_URL="mysql://hkiapp:uchhkiapp24@@localhost:3306/hki_portal"
JWT_SECRET="7b$z@qG9!pW5rX8sL*vE#uY2hNfD(kM+J_cEaT3dGfHjKmNpQrStUvWxYz"
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="465"
EMAIL_USER="sentrahki@uty.ac.id"
EMAIL_PASS="mukj itgw ehsv axex"
CLIENT_URL="https://sentra-hki.uty.ac.id"

# --- TAMBAHAN BARU UNTUK GOOGLE SHEETS ---
GOOGLE_SHEET_ID="1AVNMzXlBey-96rz824Fx83v3zoHah8s0L7TfCOJVFiQ"
GOOGLE_CLIENT_EMAIL="analitichki@uchbooking.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4pethRKyghV6p\nDeL0SBNAKHmTwYh4nURU/02V1508TxC3hYFi2/bzGsR5YzHyEzXdwvnXt15ZJFld\n7ckS0Gmml7TVDVzGTyZ+OmpqrHhNuY/wjNuagx/vjschAyNnv50ASp6/ddJUxnfr\nEdcJZ+zXMYRM3EXtRsDI59azy0HlRsz9gmrh5A4h0FyJOBRD0CcjMeGw8uoTq+MR\nPsc6l4vpFvHDNXxTTtYMUlkuFyYjDybHFKSw++DbRiUF06mPkHlWVX3AmdJEfk4r\n89a2aU5grHnMs9SjVoyKr9KJZLeArI7Q3ILcdfMrk0e196l3sz+aCCQaFAvnQf9s\nsxLrBVL7AgMBAAECggEAGQqneXGO19Y+mD7B4M9FjRXwJxHAKFtrwPs+0muDb4Jp\nifoZKgca3q1qp+vEAkiIraKbr522tfAwDoUJF/wb1/QLGjnNszdYyRWzCPSK/D+G\nPeFchv/xfNOoPdnnG1LpP/jevqiD9etUqBSrTSNDA4w7nRDiiuNlkdmfTJLsROOy\nMbuAyjAElN51A7+qXZrlE6y9LhFcvASQ+VE0BJEqscKp4sDBdwFJLS1TQg5AC4yB\nxi/4oAECz2Jge14LQg38LmUpLMjpSwingayZIitWlhtvwl4L7KVYm4VUH9XzXRSw\nx2xDUdjpxHAly9/1clX2JJAnnHP3nGOFMvfwyKh1gQKBgQDjO34vmDjLehRO8ulA\nEcs1taqnRxuug//VZIQjDfyjD7/XcPz8142oEjPdA/tavuSzEc7j8QDlwhwJ8O/H\nzb5NDwpKTxLXk5FgI1j1pzhmN/E8BRvWDWWCk60GXyV7zYPuxJrBtLW58UO4tt3X\nLiBuec+8d0As5Rs+li21eYl1aQKBgQDQBkm/KAEDYOg9c5wTLfNair1aXISpFm6d\n+wKcLHSuPLqKYZU8qul/l0+NdsvG9h94Ai75qkYEiMUvMYFM5qcieXzBGPwW62WZ\nK73SlAQu23s+w71fSSyRMr/8LLjN7mA4AjQUn3LtfrD2kizokoT6TIK2E9y9ljkk\nMZ7VeflEwwKBgEF3BV6u60Xr8Ofh4cM8nR/nK7gvq1D25IDVCaCTygIsamemPKyX\naU9PlzOIjyTQtFDGw6U17L1E1BElId+dbcMDn0JTT6ld8VcSN/Hl8EC6wzw4eJGN\noH4jD4kzZjgpuGXUrIU8C9L7KDiSLo1s05kgbPHuJUYJ53R7jcWnsytpAoGAOj+4\ngLVD611ESojHyDsSrGSy9s13PB2S5du2dGKiXXOVzE/cyPsWnOqSlQsRrmmWkDUU\nUEaUiop9pGRZT146qJWaEDvdwtExRr2Pzpoxvakpjn6i1T6ZIyMxzPv813ULLkO3\nr5qiRMw34yM1Pf5hC/FGnJNdOR0KbQ8T6bTYzp8CgYAZw4yKvKjZyAw0C/A+E3ee\npw8pIDC6yGX6+GaBTrZmHDMVTD/+HKBaWOWD4+3qeU+Ao1eYvWLbtCI4OdxqZn+s\nmzd9wBrYzThAgkxnZrGPRxtypa+EpOY5T9IHYvPLenMEw4BoortmHRu1nM/Hz0XA\nojo0cZx4eNMLTGsgI+9v+Q==\n-----END PRIVATE KEY-----\n"
ENV_EOF

  npm install

  echo "🗄️ Menjalankan database migration..."
  npx prisma migrate deploy

  if [ -f "prisma/seed.ts" ]; then
    echo "🌱 Menjalankan database seeding..."
    npx prisma db seed
  fi

  echo "🔨 Building backend..."
  # Pastikan skrip build Anda sudah benar: "build": "prisma generate && tsc"
  npm run build

  echo "🚀 Starting backend dengan PM2..."
  pm2 restart hki-backend || pm2 start dist/index.js --name "hki-backend"

  echo "🛠 Deploy Frontend..."
  cd ../client

  echo "📦 Membuat file .env.local untuk client..."
  # --- PERBAIKAN 2: Hapus semua kunci rahasia dari frontend ---
  cat > .env.local << 'CLIENT_ENV_EOF'
NEXT_PUBLIC_API_URL=https://sentra-hki.uty.ac.id/api
NEXT_PUBLIC_BINDERBYTE_API_KEY="985762f00881a418fd3cae0f9d6dc0125b763ee476afa9b31e34aa7492a769f1"
CLIENT_ENV_EOF

  echo "📦 Installing frontend dependencies..."
  npm install

  echo "🔨 Building frontend..."
  npm run build

  echo "🚀 Starting frontend dengan PM2..."
  pm2 restart hki-frontend || pm2 start npm --name "hki-frontend" -- start

  echo "📊 Status PM2 processes:"
  pm2 status

  echo "🎉 Deploy selesai!"
  echo "📍 Backend: https://sentra-hki.uty.ac.id/api"
  echo "📍 Frontend: https://sentra-hki.uty.ac.id"
EOF

echo "✅ Deploy script selesai dijalankan!"