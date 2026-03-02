import express from "express";
import {
    getLaporans,
    getLaporanByUuid,
    createLaporan,
    updateLaporan,
    deleteLaporan
} from "../controllers/Laporan.js";

const router = express.Router();

router.get("/laporans", getLaporans);

router.get("/laporans/:uuid", getLaporanByUuid);

router.post("/laporans", createLaporan);

router.patch("/laporans/:uuid", updateLaporan);

router.delete("/laporans/:uuid", deleteLaporan);

export default router;