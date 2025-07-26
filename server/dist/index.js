"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/index.ts
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const pendaftaran_routes_1 = __importDefault(require("./routes/pendaftaran.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Route dasar untuk pengetesan
app.get("/", (req, res) => {
    res.send("Selamat Datang di Server HKI Portal!");
});
// Gunakan router autentikasi dengan prefix /api/auth
app.use('/api/auth', auth_routes_1.default);
// Gunakan router pendaftaran dengan prefix /api/pendaftaran
app.use('/api/pendaftaran', pendaftaran_routes_1.default);
// Gunakan router admin dengan prefix /api/admin
app.use('/api/admin', admin_routes_1.default);
// Gunakan router pengguna dengan prefix /api/user
app.use('/api/user', user_routes_1.default);
app.listen(port, () => {
    console.log(`🚀 Server berjalan di http://localhost:${port}`);
});
