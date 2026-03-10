import Tag from "../models/TagModel.js";

export const getAllTag = async (req, res) => {
    try {
        const response = await Tag.findAll({
            attributes: ['uuid', 'nama_tag']
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getTagById = async (req, res) => {
    try {
        const tag = await Tag.findOne({
            attributes: ['uuid', 'nama_tag'],
            where: {
                uuid: req.params.uuid
            }
        });
        if (!tag) return res.status(404).json({ msg: "Tag tidak ditemukan" });
        res.status(200).json(tag);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const createTag = async (req, res) => {
    const { nama_tag } = req.body || {};
    try {
        await Tag.create({
            nama_tag: nama_tag
        });
        res.status(201).json({ msg: "Tag Berhasil Dibuat" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}

export const updateTag = async (req, res) => {
    try {
        const tag = await Tag.findOne({
            where: { uuid: req.params.uuid }
        });
        if (!tag) return res.status(404).json({ msg: "Tag tidak ditemukan" });

        // Tambahkan "|| {}" agar tidak crash jika body kosong
        const { nama_tag } = req.body || {};

        // Validasi manual: pastikan nama_tag beneran dikirim dan bukan string kosong
        if (!nama_tag || nama_tag.trim() === "") {
            return res.status(400).json({ 
                msg: "Gagal update! Field 'nama_tag' wajib diisi." 
            });
        }

        const result = await Tag.update({ nama_tag }, {
            where: {
                uuid: tag.uuid
            }
        });

        // Sekarang pengecekan ini akan jalan dengan benar
        if (result[0] === 0) {
            return res.status(400).json({ 
                msg: "Gagal update! Data sama persis dengan yang lama atau field salah." 
            });
        }

        res.status(200).json({ msg: "Tag Berhasil Diupdate" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const deleteTag = async (req, res) => {
    try {
        const tag = await Tag.findOne({
            where: {
                uuid: req.params.uuid
            }
        });
        if (!tag) return res.status(404).json({ msg: "Tag tidak ditemukan" });

        await Tag.destroy({
            where: { uuid: tag.uuid }
        });
        res.status(200).json({ msg: "Tag Berhasil Dihapus" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
}