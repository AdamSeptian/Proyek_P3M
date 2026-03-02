import Laporans from "../models/LaporanModel.js";
import Users from "../models/UserModel.js";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";

export const getLaporans = async (req, res) => {
      try {
         let whereCondition = {};
     
         if (req.role === "admin") {
           whereCondition = {};
         } else if (req.role === "ketua_forum") {
           whereCondition = {
             [Op.or]: [
               { status: "verified" },
               { users_uuid: req.userUuid }
             ]
           };
         } else {
           whereCondition = { status: "verified" };
         }
     
         const response = await Laporans.findAll({
           where: whereCondition,
           attributes: ["uuid", "keterangan", "status", "file_laporan", "url", "createdAt"],
           include: [{
             model: Users,
             attributes: ["username", "role"]
           }]
         });
     
         res.status(200).json(response);
       } catch (error) {
         res.status(500).json({ msg: error.message });
       }
}

export const getLaporanByUuid = async (req, res) => {
      try {
    let whereCondition = {};

    if (req.role === "admin") {
      whereCondition = {};
    } else if (req.role === "ketua_forum") {
      whereCondition = {
        [Op.or]: [
          { status: "verified" },
          { users_uuid: req.userUuid }
        ]
      };
    } else {
      whereCondition = { status: "verified" };
    }

    const response = await Laporans.findOne({
      where: whereCondition,
      attributes: ["uuid", "keterangan", "status", "file_laporan", "url", "createdAt"],
      include: [{
      model: Users,
      attributes: ["username", "role"]
      }]
    });

    if (!response) {
      return res.status(404).json({ msg: "Laporan tidak ditemukan atau Anda tidak memiliki akses" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

export const createLaporan = async (req, res) => {
    const { keterangan} = req.body || {};

    if (req.files === null)
        return res.status(400).json({ msg: "Tidak ada file yang diunggah!" });

    if (!keterangan || keterangan === "") {
    return res.status(400).json({
      msg: "Keterangan wajib diisi",
    });
  }

  const file = req.files.file;

  const fileSize = file.data.length;
  const ext = path.extname(file.name).toLowerCase();
  const allowedType = ".pdf";

  if (!allowedType.includes(ext)) {
    return res.status(422).json({
      msg: "Format file tidak valid! Gunakan PDF",
    });
  }

  if (fileSize > 5000000) {
    return res.status(422).json({
      msg: "Ukuran file maksimal 5 MB",
    });
  }

  const fileName = file.md5 + "-" + Date.now() + ext;
  const uploadPath = `./storage/laporan/${fileName}`;
  const url = `${req.protocol}://${req.get("host")}/storage/laporan/${fileName}`;

  file.mv(uploadPath, async (err) => {
    if (err) {
      return res.status(500).json({ msg: err.message });
    }
    try {
      const newLaporan = await Laporans.create({
        keterangan: keterangan,
        file_laporan: fileName,
        url: url,
        users_uuid: req.userUuid,
      });

      res.status(201).json({
        msg: "Laporan berhasil dibuat",
        data: newLaporan
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
}

export const updateLaporan = async (req, res) => {
      try {
        const laporan = await Laporans.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });

        if (!laporan) {
            return res.status(404).json({ msg: "Laporan tidak ditemukan" });
        }

        if (laporan.status === "verified") {
            return res.status(400).json({
                msg: "Laporan yang sudah diverifikasi tidak dapat diubah"
            });
        }

        let fileName = laporan.file;

        if (req.files && req.files.file) {
          const file = req.files.file;
          const fileSize = file.data.length;
          const ext = path.extname(file.name).toLowerCase();
          const allowedType = ".pdf";

          if (!allowedType.includes(ext)) {
              return res.status(422).json({ msg: "Format harus PDF" });
          }
          if (fileSize > 5000000) {
              return res.status(422).json({ msg: "File harus kurang dari 5 MB" });
          }
          fileName = file.md5 + "_" + Date.now() + ext;
          
          await file.mv(`./storage/laporan/${fileName}`);

          const oldPath = `./storage/laporan/${laporan.file}`;
          if (laporan.file !== fileName && fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
          }
      }

        const url = `${req.protocol}://${req.get("host")}/storage/laporan/${fileName}`;

        await Laporans.update({
            keterangan: req.body.keterangan,
            file_laporan: fileName,
            url: url
        }, {
            where: {
                uuid: req.params.uuid,
            },
        });

        res.status(200).json({ msg: "Laporan berhasil diupdate" });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteLaporan = async (req, res) => {
      try {
        const laporan = await Laporans.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });

        if (!laporan) {
            return res.status(404).json({ msg: "Laporan tidak ditemukan" });
        }

        const filepath = `./storage/laporan/${laporan.file_laporan}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        await Laporans.destroy({
            where: {
                uuid: req.params.uuid,
            },
        });

        res.status(200).json({ msg: "Laporan berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const verifyLaporanByAdmin = async (req, res) => {
      try {
        const laporan = await Laporans.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });
        if (!laporan) return res.status(404).json({ msg: "Laporan tidak ditemukan" });

        await Laporans.update(
            { status: "verified" },
            {
                where: {
                    uuid: req.params.uuid,
                },
            }
        );

        res.status(200).json({ msg: "Laporan berhasil diverifikasi oleh admin" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const rejectLaporanByAdmin = async (req, res) => {
      try {
        const laporan = await Laporans.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });
        if (!laporan) return res.status(404).json({ msg: "Laporan tidak ditemukan" });

        await Laporans.update(
            { status: "rejected" },
            {
                where: {
                    uuid: req.params.uuid,
                },
            }
        );

        res.status(200).json({ msg: "Laporan berhasil ditolak oleh admin" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}