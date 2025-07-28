"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
function main() {
  return __awaiter(this, void 0, void 0, function* () {
    console.log("Memulai proses seeding...");
    // 1. Buat Pengguna Admin
    const adminPassword = yield bcryptjs_1.default.hash("admin123", 10);
    const admin = yield prisma.user.upsert({
      where: { email: "admin@uty.ac.id" },
      update: {},
      create: {
        email: "admin@uty.ac.id",
        nama_lengkap: "Admin HKI",
        password: adminPassword,
        role: "Admin",
      },
    });
    console.log(`✅ Pengguna Admin dibuat/diperbarui: ${admin.email}`);
    // 2. Buat Pengguna Biasa (User)
    const userPassword = yield bcryptjs_1.default.hash("user123", 10);
    const user = yield prisma.user.upsert({
      where: { email: "user@uty.ac.id" },
      update: {},
      create: {
        email: "user@uty.ac.id",
        nama_lengkap: "User Biasa",
        password: userPassword,
        role: "User",
      },
    });
    console.log(`✅ Pengguna User dibuat/diperbarui: ${user.email}`);
    console.log("Seeding selesai.");
  });
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() =>
    __awaiter(void 0, void 0, void 0, function* () {
      yield prisma.$disconnect();
    })
  );
