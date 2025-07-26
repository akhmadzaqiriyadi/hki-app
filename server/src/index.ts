// server/src/index.ts
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from './routes/auth.routes';
import pendaftaranRoutes from './routes/pendaftaran.routes';
import adminRoutes from './routes/admin.routes';
import userRoutes from "./routes/user.routes";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Route dasar untuk pengetesan
app.get("/", (req: Request, res: Response) => {
  res.send("Selamat Datang di Server HKI Portal!");
});

// Gunakan router autentikasi dengan prefix /api/auth
app.use('/api/auth', authRoutes);

// Gunakan router pendaftaran dengan prefix /api/pendaftaran
app.use('/api/pendaftaran', pendaftaranRoutes);

// Gunakan router admin dengan prefix /api/admin
app.use('/api/admin', adminRoutes);

// Gunakan router pengguna dengan prefix /api/user
app.use('/api/user', userRoutes);

app.listen(port, () => {
  console.log(`🚀 Server berjalan di http://localhost:${port}`);
});