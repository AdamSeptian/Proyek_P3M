import Users from "../models/UserModel.js";
import Anggotas from "../models/AnggotaModel.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

export const Login = async (req, res) => {
  try {
    // Cari user berdasarkan email
    const user = await Users.findOne({
      where: {
        email: req.body.email,
      },
      include: [
        {
          model: Anggotas,
          attributes: [
            "uuid",
            "nama_lengkap",
            "gelar",
            "jabatan",
            "masa_jabat",
            "instansi",
            "linkedin",
            "google_scholar",
            "scopus",
            "sinta",
            "image",
            "url",
          ],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ msg: "Pengguna tidak ditemukan!" });
    }

    // Verifikasi Password
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) {
      return res.status(400).json({ msg: "Password salah!" });
    }

    // Jika masih ada sisa penggunaan express-session, kita simpan juga
    if (req.session) {
      req.session.userUuid = user.uuid;
      req.session.role = user.role;
      req.session.status = user.status;
    }

    // Buat JWT Token
    const accessToken = jwt.sign(
      { uuid: user.uuid, role: user.role, status: user.status },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      msg: "Login berhasil",
      accessToken: accessToken,
      uuid: user.uuid,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status, // Status (pending/verified) akan terbaca di Frontend
      ...(user.anggotas && user.anggotas.length > 0 && {
        anggota: user.anggotas,
      }),
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const Me = async (req, res) => {
  // Ambil userUuid yang sudah diekstrak oleh Middleware (JWT) atau fallback ke session
  const userUuid = req.userUuid || (req.session && req.session.userUuid);

  if (!userUuid) {
    return res.status(401).json({ msg: "Silakan login ke akun Anda!" });
  }

  try {
    const user = await Users.findOne({
      attributes: ["uuid", "username", "email", "role", "status"],
      where: {
        uuid: userUuid,
      },
      include: [{ model: Anggotas }],
    });

    if (!user) {
      if (req.session) {
        return req.session.destroy(() => {
          res.status(401).json({ msg: "Akun sudah tidak aktif atau tidak ditemukan." });
        });
      }
      return res.status(401).json({ msg: "Akun sudah tidak aktif atau tidak ditemukan." });
    }

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const Logout = (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(400).json({ msg: "Tidak dapat logout" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ 
        msg: "Anda telah logout. Jika menggunakan Token, harap hapus token di sisi client." 
      });
    });
  } else {
    res.status(200).json({ 
      msg: "Anda telah logout. Harap hapus token di sisi client." 
    });
  }
};