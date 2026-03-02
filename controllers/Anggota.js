import Anggotas from "../models/AnggotaModel.js";
import Users from "../models/UserModel.js";
import path from "path";
import fs from "fs";

export const getAnggotas = async (req, res) => {
    try {
        const response = await Anggotas.findAll({
            include: [{
                model: Users,
                attributes: ["uuid", "username", "status"],
                where: {
                    status: "verified"
                }
            }]
        });
        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const getAnggotaById = async (req, res) => {
    try {
        const response = await Anggotas.findOne({
            where: {
                uuid: req.params.uuid
            },
            include: [{
                model: Users,
                attributes: ["uuid", "username", "status"],
                where: {
                    status: "verified"
                }
            }]
        });

        if (!response) {
            return res.status(404).json({
                msg: "Anggota tidak ditemukan atau belum diverifikasi"
            });
        }

        res.status(200).json(response);

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const createAnggota = async (req, res) => {
    try {

        if (!req.files || !req.files.file) {
            return res.status(400).json({
                msg: "Tidak ada gambar diunggah"
            });
        }

        const file = req.files.file;
        const ext = path.extname(file.name).toLowerCase();
        const allowedType = [".png", ".jpg", ".jpeg"];

        if (!allowedType.includes(ext)) {
            return res.status(422).json({
                msg: "Format harus JPG, PNG, JPEG"
            });
        }

        if (file.data.length > 5000000) {
            return res.status(422).json({
                msg: "Max 5 MB"
            });
        }

        const fileName = file.md5 + "-" + Date.now() + ext;

        await file.mv(`./storage/anggota/${fileName}`);

        const url = `${req.protocol}://${req.get("host")}/storage/anggota/${fileName}`;

        await Anggotas.create({

            users_uuid: req.userUuid,
            nama_lengkap: req.body.nama_lengkap,
            gelar: req.body.gelar,
            jabatan: req.body.jabatan,
            masa_jabat: req.body.masa_jabat,
            instansi: req.body.instansi,
            linkedin: req.body.linkedin,
            google_scholar: req.body.google_scholar,
            scopus: req.body.scopus,
            sinta: req.body.sinta,
            image: fileName,
            url: url

        });

        res.status(201).json({
            msg: "Anggota berhasil dibuat"
        });

    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }
};

export const updateAnggota = async (req, res) => {
    const anggota = await Anggotas.findOne({
            where: {
                uuid: req.params.uuid
            }
        });

        if (!anggota) {
            return res.status(404).json({
                msg: "Anggota tidak ditemukan"
            });
        }

        if (req.role !== "admin" && anggota.users_uuid !== req.userUuid) {
            return res.status(403).json({
                msg: "Akses terlarang!"
            });
        }    
    let fileName = "";
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
        await file.mv(`./storage/anggota/${fileName}`);
        const oldPath = `./storage/anggota/${anggota.image}`;
        if (anggota.image !== fileName && fs.existsSync(oldPath)) {
            fs.unlinkSync(oldPath);
        }
    }
    const url = `${req.protocol}://${req.get("host")}/storage/anggota/${fileName}`;
    try {
        await Anggotas.update({
            nama_lengkap: req.body.nama_lengkap,
            gelar: req.body.gelar,
            jabatan: req.body.jabatan,
            masa_jabat: req.body.masa_jabat,
            instansi: req.body.instansi,
            linkedin: req.body.linkedin,
            google_scholar: req.body.google_scholar,
            scopus: req.body.scopus,
            sinta: req.body.sinta,
            image: fileName,
            url: url
        }, {
            where: {
                uuid: anggota.uuid
            }
        });

        res.status(200).json({
            msg: "Anggota berhasil diupdate"
        });

    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }
};

export const deleteAnggota = async (req, res) => {

    try {

        const anggota = await Anggotas.findOne({
            where: {
                uuid: req.params.uuid
            }
        });

        if (!anggota) {
            return res.status(404).json({
                msg: "Anggota tidak ditemukan"
            });
        }

        if (req.role !== "admin" && anggota.users_uuid !== req.userUuid) {
            return res.status(403).json({
                msg: "Akses terlarang"
            });
        }

        const filepath = `./storage/anggota/${anggota.image}`;

        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }

        await Anggotas.destroy({
            where: {
                uuid: anggota.uuid
            }
        });

        res.status(200).json({
            msg: "Anggota berhasil dihapus"
        });

    } catch (error) {
        res.status(500).json({
            msg: error.message
        });
    }
};