import express from "express";
import {
  getBeritas,
  getBeritaImage,
  getBeritaById,
    createBerita,
    updateBerita,
    deleteBerita,
    verifyBeritaByAdmin,
    rejectBeritaByAdmin,
    cancelVerifyBerita,
    cancelRejectBerita
} from "../controllers/Beritas.js";
import { 
    verifyUser,
    optionalVerifyUser,
    adminOnly,
    adminOrHumas,
    onlyVerified,
    adminOrSelf,
 } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/beritas", optionalVerifyUser,getBeritas);

router.get("/storage/berita/:filename", optionalVerifyUser, getBeritaImage);

router.get("/beritas/:uuid",optionalVerifyUser, getBeritaById);

router.post("/beritas", verifyUser, adminOrHumas, onlyVerified, createBerita);

router.patch("/beritas/:uuid", verifyUser, adminOrHumas, onlyVerified, adminOrSelf, updateBerita);

router.delete("/beritas/:uuid", verifyUser,adminOrHumas, onlyVerified, adminOrSelf, deleteBerita);

router.patch("/beritas/:uuid/verify", verifyUser, adminOnly, onlyVerified, verifyBeritaByAdmin);

router.patch("/beritas/:uuid/reject", verifyUser, adminOnly, onlyVerified, rejectBeritaByAdmin);

router.patch('/beritas/:uuid/cancel-verify', verifyUser, adminOnly, onlyVerified, cancelVerifyBerita);

router.patch('/beritas/:uuid/cancel-reject', verifyUser, adminOnly, onlyVerified, cancelRejectBerita);

export default router; 