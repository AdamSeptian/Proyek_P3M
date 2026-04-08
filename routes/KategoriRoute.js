import express from "express";
import {
    getAllKategori,
    getKategoriById,
    getBeritaByKategori,
    createKategori,
    updateKategori,
    deleteKategori
} from "../controllers/Kategori.js";

import {
    verifyUser,
    adminOnly,
    optionalVerifyUser,
    onlyVerified
} from "../middleware/AuthUser.js"

const router = express.Router();

router.get('/kategori', optionalVerifyUser, getAllKategori);
router.get('/kategori/:uuid', optionalVerifyUser, getKategoriById);
router.get('/kategori/:uuid/berita', getBeritaByKategori);
router.post('/kategori', verifyUser, onlyVerified, adminOnly, createKategori);
router.patch('/kategori/:uuid', verifyUser, onlyVerified, adminOnly, updateKategori);
router.delete('/kategori/:uuid', verifyUser, onlyVerified, adminOnly, deleteKategori);

export default router;