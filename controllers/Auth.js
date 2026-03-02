import Users from "../models/UserModel.js";
import Anggotas from "../models/AnggotaModel.js";
import argon2 from "argon2";

export const Login = async (req, res) => {
  try {
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

    if (!user)
      return res.status(404).json({ msg: "Pengguna tidak ditemukan!" });

    const match = await argon2.verify(user.password, req.body.password);

    if (!match)
      return res.status(400).json({ msg: "Password salah!" });

    // simpan session
    req.session.userUuid = user.uuid;
    req.session.role = user.role;
    req.session.status = user.status;

    res.status(200).json({
      msg: "Login berhasil",
      uuid: user.uuid,
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      ...(user.anggotas && user.anggotas.length > 0 && { anggota: user.anggotas })
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const Me = async (req, res) => {
  if (!req.session.userUuid) {
    return res.status(401).json({ msg: "Silakan login ke akun Anda!" });
  }

  try {
    const user = await Users.findOne({
      attributes: ["uuid", "username", "email", "role", "status"],
      where: {
        uuid: req.session.userUuid,
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

    if (!user)
      return res.status(404).json({ msg: "User tidak ditemukan" });

    res.status(200).json(user);

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const Logout = (req, res) => {
  req.session.destroy((err) => {
    if (err)
      return res.status(400).json({ msg: "Tidak dapat logout" });

    res.status(200).json({ msg: "Anda telah logout" });
  });
};