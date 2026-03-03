import express from "express";
import {
    getLaporans,
    getLaporanByUuid,
    createLaporan,
    updateLaporan,
    deleteLaporan,
    verifyLaporanByAdmin,
    rejectLaporanByAdmin,
    getLaporanFile
} from "../controllers/Laporan.js";
import {
    verifyUser,
    optionalVerifyUser,
    adminOnly,
    adminOrKetuaForum,
    onlyVerified,
    adminOrSelf
} from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/laporans", optionalVerifyUser, getLaporans);

router.get("/storage/laporan/:filename", optionalVerifyUser, getLaporanFile);

router.get("/laporans/:uuid", optionalVerifyUser, getLaporanByUuid);

router.post("/laporans", verifyUser, adminOrKetuaForum, createLaporan);

router.patch("/laporans/:uuid", verifyUser, adminOrKetuaForum, adminOrSelf, updateLaporan);

router.delete("/laporans/:uuid", verifyUser, adminOrKetuaForum, adminOrSelf, deleteLaporan);

router.patch("/laporans/:uuid/verify", verifyUser, adminOnly, onlyVerified, verifyLaporanByAdmin);

router.patch("/laporans/:uuid/reject", verifyUser, adminOnly, onlyVerified, rejectLaporanByAdmin);

export default router;