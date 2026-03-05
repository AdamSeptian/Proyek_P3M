import Beritas from "../models/BeritaModel.js";
import Users from "../models/UserModel.js";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getBeritas = async (req, res) => {
  try {
    let whereCondition = {};

    if (req.role === "admin") {
      whereCondition = {};
    } else if (req.role === "humas") {
      whereCondition = {
        [Op.or]: [
          { status: "verified" },
          { users_uuid: req.userUuid }
        ]
      };
    } else {
      whereCondition = { status: "verified" };
    }

    const response = await Beritas.findAll({
      where: whereCondition,
      attributes: ["uuid", "judul_berita", "isi_berita", "status", "image", "url", "createdAt"],
      include: [{
        model: Users,
        attributes: ["username"]
      }]
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getBeritaImage = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, "../storage/berita", filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ msg: "Gambar tidak ditemukan" });
        }

        const berita = await Beritas.findOne({
            where: { image: filename }
        });

        if (!berita) {
            return res.status(404).json({ msg: "Data berita tidak ditemukan" });
        }
        if (berita.status !== "verified") {
            const isAdmin = req.role === "admin";
            const isOwner = req.userUuid === berita.users_uuid;

            if (!isAdmin && !isOwner) {
                return res.status(403).json({ 
                    msg: "Akses ditolak." 
                });
            }
        }

        res.sendFile(filePath);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getBeritaById = async (req, res) => {
  try {
    let whereCondition = {};

    if (req.role === "admin") {
      whereCondition = {};
    } else if (req.role === "humas") {
      whereCondition = {
        [Op.or]: [
          { status: "verified" },
          { users_uuid: req.userUuid }
        ]
      };
    } else {
      whereCondition = { status: "verified" };
    }

    const response = await Beritas.findOne({
      where: whereCondition,
      attributes: ["uuid", "judul_berita", "isi_berita", "status", "createdAt", "updatedAt"],
      include: [{
        model: Users,
        attributes: ["username", "role"]
      }]
    });

    if (!response) {
      return res.status(404).json({ msg: "Berita tidak ditemukan atau Anda tidak memiliki akses" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createBerita = async (req, res) => {
  const { judul_berita, isi_berita } = req.body || {};

  if (req.files === null)
    return res.status(400).json({ msg: "Tidak ada gambar yang diunggah!" });
  
  if (!judul_berita || judul_berita === "") {
    return res.status(400).json({
      msg: "Judul berita wajib diisi",
    });
  }

  if (!isi_berita || isi_berita === "") {
    return res.status(400).json({
      msg: "Isi berita wajib diisi",
    });
  }

  const file = req.files.file;

  const fileSize = file.data.length;
  const ext = path.extname(file.name).toLowerCase();
  const allowedType = [".png", ".jpg", ".jpeg"];

  if (!allowedType.includes(ext)) {
    return res.status(422).json({
      msg: "Format gambar tidak valid! Gunakan JPG, JPEG, atau PNG",
    });
  }

  if (fileSize > 5000000) {
    return res.status(422).json({
      msg: "Ukuran gambar maksimal 5 MB",
    });
  }

  const fileName = file.md5 + "-" + Date.now() + ext;
  const uploadPath = `./storage/berita/${fileName}`;
  const url = `${req.protocol}://${req.get("host")}/storage/berita/${fileName}`;

  file.mv(uploadPath, async (err) => {
    if (err) {
      return res.status(500).json({ msg: err.message });
    }
    try {
      const newBerita = await Beritas.create({
        judul_berita: judul_berita,
        isi_berita: isi_berita,
        image: fileName,
        url: url,
        users_uuid: req.userUuid,
      });

      res.status(201).json({
        msg: "Berita berhasil dibuat",
        data: newBerita
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          msg: "Data tidak valid, pastikan semua field terisi dengan benar",
        });
      }

      res.status(500).json({
        msg: error.message,
      });
    }
  });
};

export const updateBerita = async (req, res) => {
    try {
        const berita = await Beritas.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });

        if (!berita) {
            return res.status(404).json({ msg: "Berita tidak ditemukan" });
        }

        if (berita.status === "verified") {
            return res.status(400).json({
                msg: "Berita yang sudah diverifikasi tidak dapat diubah"
            });
        }

        let fileName = berita.image;

        if (req.files && req.files.file) {
          const file = req.files.file;
          const fileSize = file.data.length;
          const ext = path.extname(file.name).toLowerCase();
          const allowedType = [".png", ".jpg", ".jpeg"];

          if (!allowedType.includes(ext)) {
              return res.status(422).json({ msg: "Format harus JPG, PNG, atau JPEG" });
          }
          if (fileSize > 5000000) {
              return res.status(422).json({ msg: "Image harus kurang dari 5 MB" });
          }

          fileName = file.md5 + "_" + Date.now() + ext;

          await file.mv(`./storage/berita/${fileName}`);

          const oldPath = `./storage/berita/${berita.image}`;
          if (berita.image !== fileName && fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
          }
      }

        const url = `${req.protocol}://${req.get("host")}/storage/berita/${fileName}`;

        await Beritas.update({
            judul_berita: req.body.judul_berita,
            isi_berita: req.body.isi_berita,
            image: fileName,
            url: url
        }, {
            where: {
                uuid: req.params.uuid,
            },
        });

        res.status(200).json({ msg: "Berita berhasil diupdate" });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};


export const deleteBerita = async (req, res) => {
    try {
        const berita = await Beritas.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });

        if (!berita) {
            return res.status(404).json({ msg: "Berita tidak ditemukan" });
        }

        const filepath = `./storage/berita/${berita.image}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        await Beritas.destroy({
            where: {
                uuid: req.params.uuid,
            },
        });

        res.status(200).json({ msg: "Berita berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const verifyBeritaByAdmin = async (req, res) => {
    try {
        const berita = await Beritas.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });
        if (!berita) return res.status(404).json({ msg: "Berita tidak ditemukan" });

        await Beritas.update(
            { status: "verified" },
            {
                where: {
                    uuid: req.params.uuid,
                },
            }
        );

        res.status(200).json({ msg: "Berita berhasil diverifikasi oleh admin" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const rejectBeritaByAdmin = async (req, res) => {
    try {
        const berita = await Beritas.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });
        if (!berita) return res.status(404).json({ msg: "Berita tidak ditemukan" });

        await Beritas.update(
            { status: "rejected" },
            {
                where: {
                    uuid: req.params.uuid,
                },
            }
        );

        res.status(200).json({ msg: "Berita berhasil ditolak oleh admin" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};