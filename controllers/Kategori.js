import Kategori from "../models/KategoriModel.js";

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
    try {
        await Kategori.create({
            nama_kategori: nama_kategori
        });
        res.status(201).json({ msg: "Kategori Berhasil Dibuat" });
    } catch (error) {
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
        await Kategori.update({ nama_kategori }, {
            where: {
                uuid: kategori.uuid
            }
        });
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