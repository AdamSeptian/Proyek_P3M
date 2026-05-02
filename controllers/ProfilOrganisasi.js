import ProfilOrganisasi from "../models/ProfilOrganisasiModel.js";
import Users from "../models/UserModel.js";
import path from "path";
import { Op } from "sequelize";
import fs from "fs";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const getProfilOrganisasis = async (req, res) => {
      try {
        let whereCondition = {};
        
            if (req.role === "admin" || req.role === "ketua_forum" || req.role === "humas") {
            whereCondition = {};
            } else {
            whereCondition = { status: "verified" };
            }

        const response = await ProfilOrganisasi.findAll({
        where: whereCondition,
        attributes: ["uuid", "nama_organisasi", "deskripsi_organisasi", "image", "url", "status", "createdAt", "updatedAt"],
        include: [{
            model: Users,
            attributes: ["username"]
        }]
        });

        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getProfilOrganisasiImage = async (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(__dirname, "../storage/profil", filename);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ msg: "Gambar tidak ditemukan" });
        }

        const profil = await ProfilOrganisasi.findOne({
            where: { image: filename }
        });

        if (!profil) {
            return res.status(404).json({ msg: "Data profil tidak ditemukan" });
        }
        if (profil.status !== "verified") {
            const isAdmin = req.role === "admin";
            const isOwner = req.userUuid === profil.users_uuid;
            const isHumas = req.role === "humas";

            if (!isAdmin && !isOwner && !isHumas) {
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

export const createProfilOrganisasi = async (req, res) => {
  try {
    const countProfil = await ProfilOrganisasi.count();
    if (countProfil > 0) {
      return res.status(400).json({
        msg: "Profil organisasi sudah ada! Anda hanya diperbolehkan membuat satu data. Silakan gunakan fitur Update jika ingin mengubah informasi.",
      });
    }

    const { nama_organisasi, deskripsi_organisasi } = req.body || {};
    if (!nama_organisasi || !deskripsi_organisasi) {
      return res.status(400).json({ msg: "Nama dan Deskripsi organisasi wajib diisi" });
    }

    if (!req.files || !req.files.file) {
      return res.status(400).json({ msg: "Tidak ada gambar yang diunggah!" });
    }

    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name).toLowerCase();
    const allowedType = [".png", ".jpg", ".jpeg"];

    if (!allowedType.includes(ext)) {
      return res.status(422).json({ msg: "Format gambar harus JPG, JPEG, atau PNG" });
    }

    if (fileSize > 5000000) {
      return res.status(422).json({ msg: "Ukuran gambar maksimal 5 MB" });
    }

    const fileName = file.md5 + "-" + Date.now() + ext;
    const uploadPath = `./storage/profil/${fileName}`;
    const url = `${req.protocol}://${req.get("host")}/storage/profil/${fileName}`;

    await file.mv(uploadPath);

    const newProfilOrganisasi = await ProfilOrganisasi.create({
      nama_organisasi: nama_organisasi,
      deskripsi_organisasi: deskripsi_organisasi,
      image: fileName,
      url: url,
      users_uuid: req.userUuid,
    });

    res.status(201).json({
      msg: "Profil organisasi berhasil dibuat",
      data: newProfilOrganisasi
    });

  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const updateProfilOrganisasi = async (req, res) => {
        try {
        const profilOrganisasi = await ProfilOrganisasi.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });

        if (!profilOrganisasi) {
            return res.status(404).json({ msg: "Profil organisasi tidak ditemukan" });
        }

        let fileName = profilOrganisasi.image;

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

          await file.mv(`./storage/profil/${fileName}`);

          const oldPath = `./storage/profil/${profilOrganisasi.image}`;
          if (profilOrganisasi.image !== fileName && fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
          }
      }

        const url = `${req.protocol}://${req.get("host")}/storage/profil/${fileName}`;

        await ProfilOrganisasi.update({
            nama_organisasi: req.body.nama_organisasi,
            deskripsi_organisasi: req.body.deskripsi_organisasi,
            image: fileName,
            url: url
        }, {
            where: {
                uuid: req.params.uuid,
            },
        });

        res.status(200).json({ msg: "Profil organisasi berhasil diupdate" });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteProfilOrganisasi = async (req, res) => {
        try {
            const profilOrganisasi = await ProfilOrganisasi.findOne({
                where: {
                    uuid: req.params.uuid,
                },
            });
    
            if (!profilOrganisasi) {
                return res.status(404).json({ msg: "Profil organisasi tidak ditemukan" });
            }
    
            const filepath = `./storage/profil/${profilOrganisasi.image}`;
            if (fs.existsSync(filepath)) {
                fs.unlinkSync(filepath);
            }
    
            await ProfilOrganisasi.destroy({
                where: {
                    uuid: req.params.uuid,
                },
            });
    
            res.status(200).json({ msg: "Profil organisasi berhasil dihapus" });
    
        } catch (error) {
            res.status(500).json({ msg: error.message });
        }
}

export const verifyProfilOrganisasi = async (req, res) => {
        try {
            const profilOrganisasi = await ProfilOrganisasi.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });
        if (!profilOrganisasi) return res.status(404).json({ msg: "Profil organisasi tidak ditemukan" });

        await ProfilOrganisasi.update(
            { status: "verified" },
            {
                where: {
                    uuid: req.params.uuid,
                },
            }
        );

        res.status(200).json({ msg: "Profil organisasi berhasil diverifikasi oleh admin" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const rejectProfilOrganisasi = async (req, res) => {
        try {
        const profilOrganisasi = await ProfilOrganisasi.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });
        if (!profilOrganisasi) return res.status(404).json({ msg: "Profil organisasi tidak ditemukan" });

        await ProfilOrganisasi.update(
            { status: "rejected" },
            {
                where: {
                    uuid: req.params.uuid,
                },
            }
        );

        res.status(200).json({ msg: "Profil organisasi berhasil ditolak oleh admin" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const cancelVerifyProfilOrganisasi = async (req, res) => {
  try {
    const profilOrganisasi = await ProfilOrganisasi.findOne({
      where: { uuid: req.params.uuid }
    });

    if (!profilOrganisasi) return res.status(404).json({ msg: "Profil organisasi tidak ditemukan" });

    await ProfilOrganisasi.update(
      { status: "pending" },
      { where: { uuid: req.params.uuid } }
    );

    res.status(200).json({ msg: "Verifikasi dibatalkan, status kembali ke Pending" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const cancelRejectProfilOrganisasi = async (req, res) => {
  try {
    const profilOrganisasi = await ProfilOrganisasi.findOne({
      where: { uuid: req.params.uuid }
    });

    if (!profilOrganisasi) return res.status(404).json({ msg: "Profil organisasi tidak ditemukan" });

    await ProfilOrganisasi.update(
      { status: "pending" },
      { where: { uuid: req.params.uuid } }
    );

    res.status(200).json({ msg: "Penolakan dibatalkan, status kembali ke Pending" });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};