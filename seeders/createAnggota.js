import db from "../config/database.js";
import Users from "../models/UserModel.js";
import Anggotas from "../models/AnggotaModel.js";
import argon2 from "argon2";

const seedUsersAndAnggotas = async () => {
  try {
    await db.sync();

    // hash password
    const passwordHash = await argon2.hash("password123");

    // buat user
    const users = await Users.bulkCreate([
      {
        uuid: "user-uuid-1",
        username: "admin",
        email: "admin@gmail.com",
        password: passwordHash,
        role: "admin",
        status: "verified",
      },
      {
        uuid: "user-uuid-2",
        username: "humas1",
        email: "humas1@gmail.com",
        password: passwordHash,
        role: "humas",
        status: "verified",
      },
      {
        uuid: "user-uuid-3",
        username: "anggota1",
        email: "anggota1@gmail.com",
        password: passwordHash,
        role: "anggota",
        status: "verified",
      },
    ]);

    // buat anggota (relasi ke users_uuid)
    await Anggotas.bulkCreate([
      {
        uuid: "anggota-uuid-1",
        users_uuid: "user-uuid-3",
        nama_lengkap: "Dr. Budi Santoso",
        gelar: "S.Kom., M.Kom.",
        jabatan: "Ketua",
        masa_jabat: "2024-2028",
        instansi: "Universitas Contoh",
        linkedin: "https://linkedin.com/in/budi",
        google_scholar: "https://scholar.google.com/budi",
        scopus: "https://scopus.com/budi",
        sinta: "https://sinta.kemdikbud.go.id/budi",
        image: "budi.jpg",
        url: "http://localhost:5000/images/budi.jpg",
      },
      {
        uuid: "anggota-uuid-2",
        users_uuid: "user-uuid-3",
        nama_lengkap: "Siti Rahmawati",
        gelar: "S.T., M.T.",
        jabatan: "Sekretaris",
        masa_jabat: "2024-2028",
        instansi: "Universitas Contoh",
        linkedin: "https://linkedin.com/in/siti",
        google_scholar: null,
        scopus: null,
        sinta: null,
        image: "siti.jpg",
        url: "http://localhost:5000/images/siti.jpg",
      },
    ]);

    console.log("Seeder berhasil dijalankan");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedUsersAndAnggotas();