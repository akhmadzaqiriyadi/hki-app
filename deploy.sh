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

  echo "📦 Membuat file .env untuk server..."
  # Buat .env untuk server dengan semua environment variables
  cat > .env << 'ENV_EOF'
DATABASE_URL="mysql://hkiapp:uchhkiapp24@@localhost:3306/hki_portal"
JWT_SECRET="7b$z@qG9!pW5rX8sL*vE#uY2hNfD(kM+J_cEaT3dGfHjKmNpQrStUvWxYz"

EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="465"
EMAIL_USER="sentrahki@uty.ac.id"
EMAIL_PASS="mukj itgw ehsv axex"
CLIENT_URL="https://sentra-hki.uty.ac.id"
ENV_EOF

  echo "🛠 Deploy Backend..."
  cd server
  npm install

  # Export semua environment variables agar prisma dan aplikasi bisa baca
  export $(grep -v '^#' ../.env | xargs)

  # Jalankan prisma migrate dan seed
  echo "🗄️ Menjalankan database migration..."
  npx prisma migrate deploy

  if [ -f "prisma/seed.ts" ]; then
    echo "🌱 Menjalankan database seeding..."
    npx prisma db seed
  fi

  echo "🔨 Building backend..."
  npm run build

  # Restart atau start backend dengan PM2
  echo "🚀 Starting backend dengan PM2..."
  pm2 restart hki-backend || pm2 start dist/index.js --name "hki-backend"

  echo "🛠 Deploy Frontend..."
  cd ../client

  echo "📦 Membuat file .env.local untuk client..."
  # Buat .env.local untuk client dengan semua environment variables
  cat > .env.local << 'CLIENT_ENV_EOF'
NEXT_PUBLIC_API_URL=https://sentra-hki.uty.ac.id/api
NEXT_PUBLIC_BINDERBYTE_API_KEY="985762f00881a418fd3cae0f9d6dc0125b763ee476afa9b31e34aa7492a769f1"
GOOGLE_CLIENT_EMAIL="analitichki@uchbooking.iam.gserviceaccount.com"
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC4pethRKyghV6p
DeL0SBNAKHmTwYh4nURU/02V1508TxC3hYFi2/bzGsR5YzHyEzXdwvnXt15ZJFld
7ckS0Gmml7TVDVzGTyZ+OmpqrHhNuY/wjNuagx/vjschAyNnv50ASp6/ddJUxnfr
EdcJZ+zXMYRM3EXtRsDI59azy0HlRsz9gmrh5A4h0FyJOBRD0CcjMeGw8uoTq+MR
Psc6l4vpFvHDNXxTTtYMUlkuFyYjDybHFKSw++DbRiUF06mPkHlWVX3AmdJEfk4r
89a2aU5grHnMs9SjVoyKr9KJZLeArI7Q3ILcdfMrk0e196l3sz+aCCQaFAvnQf9s
sxLrBVL7AgMBAAECggEAGQqneXGO19Y+mD7B4M9FjRXwJxHAKFtrwPs+0muDb4Jp
ifoZKgca3q1qp+vEAkiIraKbr522tfAwDoUJF/wb1/QLGjnNszdYyRWzCPSK/D+G
PeFchv/xfNOoPdnnG1LpP/jevqiD9etUqBSrTSNDA4w7nRDiiuNlkdmfTJLsROOy
MbuAyjAElN51A7+qXZrlE6y9LhFcvASQ+VE0BJEqscKp4sDBdwFJLS1TQg5AC4yB
xi/4oAECz2Jge14LQg38LmUpLMjpSwingayZIitWlhtvwl4L7KVYm4VUH9XzXRSw
x2xDUdjpxHAly9/1clX2JJAnnHP3nGOFMvfwyKh1gQKBgQDjO34vmDjLehRO8ulA
Ecs1taqnRxuug//VZIQjDfyjD7/XcPz8142oEjPdA/tavuSzEc7j8QDlwhwJ8O/H
zb5NDwpKTxLXk5FgI1j1pzhmN/E8BRvWDWWCk60GXyV7zYPuxJrBtLW58UO4tt3X
LiBuec+8d0As5Rs+li21eYl1aQKBgQDQBkm/KAEDYOg9c5wTLfNair1aXISpFm6d
+wKcLHSuPLqKYZU8qul/l0+NdsvG9h94Ai75qkYEiMUvMYFM5qcieXzBGPwW62WZ
K73SlAQu23s+w71fSSyRMr/8LLjN7mA4AjQUn3LtfrD2kizokoT6TIK2E9y9ljkk
MZ7VeflEwwKBgEF3BV6u60Xr8Ofh4cM8nR/nK7gvq1D25IDVCaCTygIsamemPKyX
aU9PlzOIjyTQtFDGw6U17L1E1BElId+dbcMDn0JTT6ld8VcSN/Hl8EC6wzw4eJGN
oH4jD4kzZjgpuGXUrIU8C9L7KDiSLo1s05kgbPHuJUYJ53R7jcWnsytpAoGAOj+4
gLVD611ESojHyDsSrGSy9s13PB2S5du2dGKiXXOVzE/cyPsWnOqSlQsRrmmWkDUU
UEaUiop9pGRZT146qJWaEDvdwtExRr2Pzpoxvakpjn6i1T6ZIyMxzPv813ULLkO3
r5qiRMw34yM1Pf5hC/FGnJNdOR0KbQ8T6bTYzp8CgYAZw4yKvKjZyAw0C/A+E3ee
pw8pIDC6yGX6+GaBTrZmHDMVTD/+HKBaWOWD4+3qeU+Ao1eYvWLbtCI4OdxqZn+s
mzd9wBrYzThAgkxnZrGPRxtypa+EpOY5T9IHYvPLenMEw4BoortmHRu1nM/Hz0XA
ojo0cZx4eNMLTGsgI+9v+Q==
-----END PRIVATE KEY-----"
GOOGLE_SHEET_ID="1AVNMzXlBey-96rz824Fx83v3zoHah8s0L7TfCOJVFiQ"
CLIENT_ENV_EOF

  echo "📦 Installing frontend dependencies..."
  npm install

  echo "🔨 Building frontend..."
  npm run build

  # Restart atau start frontend dengan PM2
  echo "🚀 Starting frontend dengan PM2..."
  pm2 restart hki-frontend || pm2 start npm --name "hki-frontend" -- start

  echo "📊 Status PM2 processes:"
  pm2 status

  echo "🎉 Deploy selesai!"
  echo "📍 Backend: https://sentra-hki.uty.ac.id/api"
  echo "📍 Frontend: https://sentra-hki.uty.ac.id"
EOF

echo "✅ Deploy script selesai dijalankan!"