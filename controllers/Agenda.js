import Agendas from "../models/AgendaModel.js";
import Users from "../models/UserModel.js";
import path from "path";
import fs from "fs";
import { Op } from "sequelize";

export const getAgendas = async (req, res) => {
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

    const response = await Agendas.findAll({
      where: whereCondition,
      attributes: ["uuid", "nama_kegiatan", "tuan_rumah", "status", "jadwal", "createdAt"],
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

export const getAgendaByUuid = async (req, res) => {
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

    const response = await Agendas.findOne({
      where: whereCondition,
      attributes: ["uuid", "nama_kegiatan", "tuan_rumah", "jadwal", "status", "createdAt", "updatedAt"],
      include: [{
        model: Users,
        attributes: ["username", "role"]
      }]
    });

    if (!response) {
      return res.status(404).json({ msg: "Agenda tidak ditemukan atau Anda tidak memiliki akses" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

export const createAgenda = async (req, res) => {
    const { nama_kegiatan, tuan_rumah, jadwal } = req.body || {};

    if (req.files === null)
        return res.status(400).json({ msg: "Tidak ada file yang diunggah!" });

    if (!nama_kegiatan || nama_kegiatan === "") {
    return res.status(400).json({
      msg: "Nama kegiatan wajib diisi",
    });
  }

  if (!tuan_rumah || tuan_rumah === "") {
    return res.status(400).json({
      msg: "Tuan rumah wajib diisi",
    });
  }

  if (!jadwal || jadwal === "") {
    return res.status(400).json({
      msg: "Jadwal wajib diisi",
    });
  } else if (isNaN(Date.parse(jadwal))) {
    return res.status(400).json({
      msg: "Format jadwal tidak valid, gunakan format tanggal yang benar",
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
  const uploadPath = `./storage/agenda/${fileName}`;
  const url = `${req.protocol}://${req.get("host")}/storage/agenda/${fileName}`;

  file.mv(uploadPath, async (err) => {
    if (err) {
      return res.status(500).json({ msg: err.message });
    }
    try {
      const newAgenda = await Agendas.create({
        nama_kegiatan: nama_kegiatan,
        tuan_rumah: tuan_rumah,
        jadwal: jadwal,
        file: fileName,
        url: url,
        users_uuid: req.userUuid,
      });

      res.status(201).json({
        msg: "Agenda berhasil dibuat",
        data: newAgenda
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

export const updateAgenda = async (req, res) => {
    try {
        const agenda = await Agendas.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });

        if (!agenda) {
            return res.status(404).json({ msg: "Agenda tidak ditemukan" });
        }

        if (agenda.status === "verified") {
            return res.status(400).json({
                msg: "Agenda yang sudah diverifikasi tidak dapat diubah"
            });
        }

        let fileName = agenda.file;

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
          
          await file.mv(`./storage/agenda/${fileName}`);

          const oldPath = `./storage/agenda/${agenda.file}`;
          if (agenda.file !== fileName && fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
          }
      }

        const url = `${req.protocol}://${req.get("host")}/storage/agenda/${fileName}`;

        await Agendas.update({
            nama_kegiatan: req.body.nama_kegiatan,
            tuan_rumah: req.body.tuan_rumah,
            jadwal: req.body.jadwal,
            file: fileName,
            url: url
        }, {
            where: {
                uuid: req.params.uuid,
            },
        });

        res.status(200).json({ msg: "Agenda berhasil diupdate" });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteAgenda = async (req, res) => {
    try {
        const agenda = await Agendas.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });

        if (!agenda) {
            return res.status(404).json({ msg: "Agenda tidak ditemukan" });
        }

        const filepath = `./storage/agenda/${agenda.file}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        await Agendas.destroy({
            where: {
                uuid: req.params.uuid,
            },
        });

        res.status(200).json({ msg: "Agenda berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const verifyAgendaByAdmin = async (req, res) => {
    try {
        const agenda = await Agendas.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });
        if (!agenda) return res.status(404).json({ msg: "Agenda tidak ditemukan" });

        await Agendas.update(
            { status: "verified" },
            {
                where: {
                    uuid: req.params.uuid,
                },
            }
        );

        res.status(200).json({ msg: "Agenda berhasil diverifikasi oleh admin" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const rejectAgendaByAdmin = async (req, res) => {
    try {
        const agenda = await Agendas.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });
        if (!agenda) return res.status(404).json({ msg: "Agenda tidak ditemukan" });

        await Agendas.update(
            { status: "rejected" },
            {
                where: {
                    uuid: req.params.uuid,
                },
            }
        );

        res.status(200).json({ msg: "Agenda berhasil ditolak oleh admin" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}