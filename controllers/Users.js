import Users from "../models/UserModel.js";
import Anggotas from "../models/AnggotaModel.js";
import argon2 from "argon2";
import { Op } from "sequelize";
import path from "path";
import fs from "fs";


export const getUsers = async (req, res) => {
  try {

    let whereCondition = {};

    if (req.userUuid) {
      if (req.role === "admin") {
        whereCondition = {};
      } else {
        whereCondition = {
          [Op.or]: [
            { status: "verified" },
            { users_uuid: req.userUuid }
          ]
        };
      }
    }

    const users = await Users.findAll({
      where: whereCondition,
      attributes: { exclude: ["password"] },
      include: {
        model: Anggotas,
      },
    });

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    // Pastikan UUID selalu jadi filter utama
    let whereCondition = { uuid: req.params.uuid };

    if (req.role !== "admin") {
      // Jika BUKAN admin, tambahkan batasan status
      if (req.userUuid) {
        // User login: cuma bisa lihat yang verified ATAU miliknya sendiri
        whereCondition = {
          uuid: req.params.uuid,
          [Op.or]: [
            { status: "verified" },
            { uuid: req.userUuid } // Pakai uuid karena ini tabel Users
          ]
        };
      } else {
        // Pengunjung umum: cuma bisa lihat yang verified
        whereCondition.status = "verified";
      }
    }
    // Jika admin, whereCondition tetap { uuid: req.params.uuid }

    const user = await Users.findOne({
      where: whereCondition,
      attributes: { exclude: ["password"] },
      include: { model: Anggotas },
    });

    if (!user) {
      return res.status(404).json({
        msg: "User tidak ditemukan atau Anda tidak memiliki akses"
      });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const register = async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    nama_lengkap,
    gelar,
    jabatan,
    masa_jabat,
    instansi,
    linkedin,
    google_scholar,
    scopus,
    sinta,
  } = req.body || {};

  try {

    if (req.session.userUuid && req.session.role !== "admin") {
      return res.status(400).json({
        msg: "Anda masih login. Silakan logout terlebih dahulu sebelum registrasi akun baru.",
      });
    }

    if (!username || username === "")
      return res.status(422).json({ msg: "Username wajib diisi" });

    if (!email || email === "")
      return res.status(422).json({ msg: "Email wajib diisi" });

    if (!password)
      return res.status(422).json({ msg: "Password wajib diisi" });

    if (password.length < 6)
      return res.status(422).json({ msg: "Password minimal 6 karakter" });

    const existingEmail = await Users.findOne({
      where: { email: email },
    });

    if (existingEmail) {
      return res.status(400).json({
        msg: "Email sudah terdaftar. Gunakan email lain.",
      });
    }
    const isAdmin = req.session.userUuid && req.session.role === "admin";

    if (!isAdmin) {

      if (!req.files || !req.files.file)
        return res.status(400).json({ msg: "Mohon unggah foto profil" });

      if (!nama_lengkap || nama_lengkap === "")
        return res.status(422).json({ msg: "Nama lengkap wajib diisi" });

      if (!gelar || gelar === "")
        return res.status(422).json({ msg: "Gelar wajib diisi" });

      if (!jabatan || jabatan === "")
        return res.status(422).json({ msg: "Jabatan wajib diisi" });

      if (!masa_jabat || masa_jabat === "")
        return res.status(422).json({ msg: "Masa jabatan wajib diisi" });

      if (!instansi || instansi === "")
        return res.status(422).json({ msg: "Instansi wajib diisi" });

    }

    const hashPassword = await argon2.hash(password);

    const newUser = await Users.create({
      username,
      email,
      password: hashPassword,
      role: isAdmin ? role : "anggota",
      status: isAdmin ? "verified" : "pending",
    });

    if (!isAdmin) {

      const file = req.files.file;
      const ext = path.extname(file.name).toLowerCase();

      const allowedType = [".png", ".jpg", ".jpeg"];
      if (!allowedType.includes(ext))
        return res.status(422).json({ msg: "Format harus JPG, PNG, JPEG" });

      if (file.data.length > 5000000)
        return res.status(422).json({ msg: "Ukuran foto maksimal 5 MB" });

      const fileName = file.md5 + "-" + Date.now() + ext;

      const uploadDir = "./storage/anggota";
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uploadPath = `${uploadDir}/${fileName}`;
      await file.mv(uploadPath);

      const url = `${req.protocol}://${req.get("host")}/storage/anggota/${fileName}`;

      await Anggotas.create({
        users_uuid: newUser.uuid,
        nama_lengkap,
        gelar,
        jabatan,
        masa_jabat,
        instansi,
        linkedin,
        google_scholar,
        scopus,
        sinta,
        image: fileName,
        url: url,
      });
    }

    res.status(201).json({
      msg: isAdmin
        ? "User berhasil dibuat oleh admin"
        : "Registrasi berhasil! Akun Anda sedang menunggu verifikasi admin.",
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const updateUsers = async (req, res) => {
  try {
    const user = await Users.findOne({
      where: { uuid: req.params.uuid },
      include: [{ model: Anggotas, as: "anggotas" }],
    });

    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }

    if (req.role !== "admin" && req.userUuid !== user.uuid) {
      return res.status(403).json({ msg: "Akses terlarang!" });
    }

    const {
      username, email, password,
      nama_lengkap, gelar, jabatan, masa_jabat,
      instansi, linkedin, google_scholar, scopus, sinta,
    } = req.body;

    let hashPassword = user.password;
    if (password && password !== "") {
      hashPassword = await argon2.hash(password);
    }

    const updateData = {
      username,
      email,
      password: hashPassword,
    };

    if (req.role === "admin") {
      updateData.role = req.body.role;
      updateData.status = req.body.status;
    }

    await Users.update(updateData, {
      where: { uuid: user.uuid },
    });

    const anggota = user.anggota;
    let fileName = anggota ? anggota.image : null;

    if (req.files && req.files.file) {
      const file = req.files.file;
      const ext = path.extname(file.name).toLowerCase();
      const allowedType = [".png", ".jpg", ".jpeg"];

      if (!allowedType.includes(ext)) {
        return res.status(422).json({ msg: "Format harus JPG, PNG, atau JPEG" });
      }
      if (file.data.length > 5000000) {
        return res.status(422).json({ msg: "Ukuran foto maksimal 5 MB" });
      }

      const newFileName = file.md5 + "-" + Date.now() + ext;

      if (!fs.existsSync("./storage/anggota")) {
        fs.mkdirSync("./storage/anggota", { recursive: true });
      }

      await file.mv(`./storage/anggota/${newFileName}`);

      if (fileName && fileName !== newFileName) {
        const oldPath = `./storage/anggota/${fileName}`;
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      fileName = newFileName;
    }

    const url = fileName
      ? `${req.protocol}://${req.get("host")}/storage/anggota/${fileName}`
      : anggota?.url;

    const anggotaUpdateData = {
      nama_lengkap,
      gelar,
      jabatan,
      masa_jabat,
      instansi,
      linkedin,
      google_scholar,
      scopus,
      sinta,
    };

    // Hanya update image & url kalau ada fileName-nya
    if (fileName) {
      anggotaUpdateData.image = fileName;
      anggotaUpdateData.url = url;
    }
    await Anggotas.update(
      anggotaUpdateData,
      {
        where: { users_uuid: user.uuid },
      }
    );

    res.status(200).json({ msg: "User berhasil diupdate" });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const deleteUsers = async (req, res) => {
  try {

    const user = await Users.findOne({
      where: {
        uuid: req.params.uuid,
      },
    });
    if (!user) {
      return res.status(404).json({ msg: "User tidak ditemukan" });
    }
    if (req.role !== "admin" && req.userUuid !== user.uuid) {
      return res.status(403).json({ msg: "Akses terlarang!" });
    }
    await Users.destroy({
      where: {
        uuid: user.uuid,
      },
    });

    res.status(200).json({ msg: "User berhasil dihapus" });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const rejectUserByAdmin = async (req, res) => {
  try {

    if (req.role !== "admin") {
      return res.status(403).json({ msg: "Akses terlarang!" });
    }

    await Users.update(
      { status: "rejected" },
      {
        where: {
          uuid: req.params.uuid,
        },
      }
    );

    res.status(200).json({ msg: "User berhasil direject" });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const verifyUserByAdmin = async (req, res) => {
  try {

    if (req.role !== "admin") {
      return res.status(403).json({ msg: "Akses terlarang!" });
    }

    await Users.update(
      { status: "verified" },
      {
        where: {
          uuid: req.params.uuid,
        },
      }
    );

    res.status(200).json({ msg: "User berhasil diverifikasi" });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};