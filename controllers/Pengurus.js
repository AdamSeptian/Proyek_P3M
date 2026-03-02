import Pengurus from "../models/PengurusModel.js";
import path from "path";
import fs from "fs";

export const getPenguruses = async (req, res) => {
      try {

    const response = await Pengurus.findAll({
      attributes: ["uuid", "nama_lengkap", "jabatan", "instansi", "image", "url", "createdAt"],
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

export const getPengurusByUuid = async (req, res) => {
      try {
    const response = await Pengurus.findOne({
      where: {
        uuid: req.params.uuid
      },
      attributes: ["uuid", "nama_lengkap", "jabatan", "instansi", "image", "url", "createdAt"],
    });

    if (!response) {
      return res.status(404).json({ msg: "Pengurus tidak ditemukan" });
    }

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

export const createPengurus = async (req, res) => {
  const { nama_lengkap, jabatan, instansi } = req.body || {};

  if (req.files === null)
    return res.status(400).json({ msg: "Tidak ada gambar yang diunggah!" });
  
  if (!nama_lengkap || nama_lengkap === "") {
    return res.status(400).json({
      msg: "Nama lengkap wajib diisi",
    });
  }

  if (!jabatan || jabatan === "") {
    return res.status(400).json({
      msg: "Jabatan wajib diisi",
    });
  }

  if (!instansi || instansi === "") {
    return res.status(400).json({
      msg: "Instansi wajib diisi",
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
  const uploadPath = `./storage/pengurus/${fileName}`;
  const url = `${req.protocol}://${req.get("host")}/storage/pengurus/${fileName}`;

  file.mv(uploadPath, async (err) => {
    if (err) {
      return res.status(500).json({ msg: err.message });
    }
    try {
      const newPengurus = await Pengurus.create({
        nama_lengkap: nama_lengkap,
        jabatan: jabatan,
        instansi: instansi,
        image: fileName,
        url: url,
      });

      res.status(201).json({
        msg: "Pengurus berhasil dibuat",
        data: newPengurus
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

export const updatePengurus = async (req, res) => {
    try {
        const pengurus = await Pengurus.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });

        if (!pengurus) {
            return res.status(404).json({ msg: "Pengurus tidak ditemukan" });
        }

        if (pengurus.status === "verified") {
            return res.status(400).json({
                msg: "Pengurus yang sudah diverifikasi tidak dapat diubah"
            });
        }

        let fileName = pengurus.image;

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

          // ✅ Generate nama unik
          fileName = file.md5 + "_" + Date.now() + ext;

          // ✅ Upload dulu
          await file.mv(`./storage/pengurus/${fileName}`);

          // ✅ Baru hapus yang lama (dan hanya kalau namanya beda)
          const oldPath = `./storage/pengurus/${pengurus.image}`;
          if (pengurus.image !== fileName && fs.existsSync(oldPath)) {
              fs.unlinkSync(oldPath);
          }
      }

        const url = `${req.protocol}://${req.get("host")}/storage/pengurus/${fileName}`;

        await Pengurus.update({
            nama_lengkap: req.body.nama_lengkap,
            jabatan: req.body.jabatan,
            instansi: req.body.instansi,
            image: fileName,
            url: url
        }, {
            where: {
                uuid: req.params.uuid,
            },
        });

        res.status(200).json({ msg: "Pengurus berhasil diupdate" });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deletePengurus = async (req, res) => {
        try {
        const pengurus = await Pengurus.findOne({
            where: {
                uuid: req.params.uuid,
            },
        });

        if (!pengurus) {
            return res.status(404).json({ msg: "Pengurus tidak ditemukan" });
        }

        const filepath = `./storage/pengurus/${pengurus.image}`;
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        await Pengurus.destroy({
            where: {
                uuid: req.params.uuid,
            },
        });

        res.status(200).json({ msg: "Pengurus berhasil dihapus" });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}