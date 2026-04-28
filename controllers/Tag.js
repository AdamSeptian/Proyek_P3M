import Tag from "../models/TagModel.js";
import Beritas from "../models/BeritaModel.js";
import Users from "../models/UserModel.js";
import { Op } from "sequelize";

export const getAllTag = async (req, res) => {
    try {
        const response = await Tag.findAll({
            attributes: ['uuid', 'nama_tag'],
            order: [['updatedAt', 'DESC']]
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

export const getBeritaByTag = async (req, res) => {
    try {
        const response = await Tag.findOne({
            where: {
                uuid: req.params.uuid
            },
            attributes: ['uuid', 'nama_tag'],
            include: [{
                model: Beritas,
                attributes: ["uuid", "judul_berita", "isi_berita", "status", "image", "url", "createdAt", "updatedAt"],
                through: { attributes: [] },
                include: [{
                    model: Users,
                    attributes: ["username"]
                }]
            }]
        });

        if (!response) return res.status(404).json({ msg: "Tag tidak ditemukan" });

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

    if (!nama_tag || nama_tag.trim() === "") {
        return res.status(400).json({ msg: "Nama tag tidak boleh kosong!" });
    }

    try {
        const checkTag = await Tag.findOne({
            where: {
                nama_tag: nama_tag
            }
        });

        if (checkTag) {
            return res.status(400).json({ msg: "Tag ini sudah terdaftar!" });
        }
        await Tag.create({
            nama_tag: nama_tag
        });
        res.status(201).json({ msg: "Tag Berhasil Dibuat" });
    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(400).json({ msg: "Nama ini sudah digunakan!" });
        }
        res.status(500).json({ msg: error.message });
    }
}

export const updateTag = async (req, res) => {
    try {
        const tag = await Tag.findOne({
            where: { uuid: req.params.uuid }
        });
        if (!tag) return res.status(404).json({ msg: "Tag tidak ditemukan" });

        const { nama_tag } = req.body || {};

        if (!nama_tag || nama_tag.trim() === "") {
            return res.status(400).json({ msg: "Nama tag tidak boleh kosong!" });
        }

        const existingTag = await Tag.findOne({
            where: {
                nama_tag: nama_tag,
                uuid: { [Op.ne]: tag.uuid } 
            }
        });

        if (existingTag) {
            return res.status(400).json({ msg: "Tag dengan nama tersebut sudah ada!" });
        }

        const result = await Tag.update({ nama_tag }, {
            where: { uuid: tag.uuid }
        });

        if (result[0] === 0) {
            return res.status(400).json({ msg: "Data tidak ada perubahan." });
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