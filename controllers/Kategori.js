import Kategori from "../models/KategoriModel.js";
import Beritas from "../models/BeritaModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";

export const getAllKategori = async (req, res) => {
    try {
        const response = await Kategori.findAll({
            attributes: ['uuid', 'nama_kategori']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getBeritaByKategori = async (req, res) => {
    try {
        const response = await Kategori.findOne({
            where: {
                uuid: req.params.uuid
            },
            attributes: ['uuid', 'nama_kategori'],
            include: [{
                model: Beritas,
                attributes: ["uuid", "judul_berita", "isi_berita", "status", "image", "url", "createdAt"],
                through: { attributes: [] },
                include: [{
                    model: Users,
                    attributes: ["username"]
                }]
            }]
        });

        if (!response) return res.status(404).json({ msg: "Kategori tidak ditemukan" });
        
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getKategoriById = async (req, res) => {
    try {
        const kategori = await Kategori.findOne({
            attributes: ['uuid', 'nama_kategori'],
            where: {
                uuid: req.params.uuid
            }
        });
        if (!kategori) return res.status(404).json({ msg: "Kategori tidak ditemukan" });
        res.status(200).json(kategori);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createKategori = async (req, res) => {
    const { nama_kategori } = req.body || {};

    if (!nama_kategori || nama_kategori.trim() === "") {
        return res.status(400).json({ msg: "Nama kategori tidak boleh kosong!" });
    }

    try {
        const checkKategori = await Kategori.findOne({
            where: {
                nama_kategori: nama_kategori
            }
        });

        if (checkKategori) {
            return res.status(400).json({ msg: "Kategori sudah ada, gunakan nama lain!" });
        }
        await Kategori.create({
            nama_kategori: nama_kategori
        });
        res.status(201).json({ msg: "Kategori Berhasil Dibuat" });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ msg: "Nama ini sudah digunakan!" });
        }
        res.status(400).json({ msg: error.message });
    }
}

export const updateKategori = async (req, res) => {
    try {
        const kategori = await Kategori.findOne({
            where: {
                uuid: req.params.uuid
            }
        });
        if (!kategori) return res.status(404).json({ msg: "Kategori tidak ditemukan" });

        const { nama_kategori } = req.body || {};

        if (!nama_kategori || nama_kategori.trim() === "") {
            return res.status(400).json({ msg: "Nama kategori tidak boleh kosong!" });
        }
        
        const existingKategori = await Kategori.findOne({
            where: {
                [Op.and]: [
                    { nama_kategori: nama_kategori },
                    { uuid: { [Op.ne]: kategori.uuid } } // Op.ne artinya Not Equal (Tidak Sama Dengan)
                ]
            }
        });

        if (existingKategori) {
            return res.status(400).json({ msg: "Nama kategori sudah digunakan oleh data lain!" });
        }

        const result = await Kategori.update({ nama_kategori }, {
            where: { uuid: kategori.uuid }
        });

        if (result[0] === 0) {
            return res.status(400).json({ msg: "Data tidak berubah." });
        }

        res.status(200).json({ msg: "Kategori Berhasil Diupdate" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const deleteKategori = async (req, res) => {
    try {
        const kategori = await Kategori.findOne({
            where: {
                uuid: req.params.uuid
            }
        });
        if (!kategori) return res.status(404).json({ msg: "Kategori tidak ditemukan" });

        await Kategori.destroy({
            where: {
                uuid: kategori.uuid
            }
        });
        res.status(200).json({ msg: "Kategori Berhasil Dihapus" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}