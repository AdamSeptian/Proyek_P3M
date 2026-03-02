import express from "express";
import {
  getBeritas,
  getBeritaById,
    createBerita,
    updateBerita,
    deleteBerita,
    verifyBeritaByAdmin,
    rejectBeritaByAdmin
} from "../controllers/Beritas.js";
import { 
    verifyUser,
    optionalVerifyUser,
    adminOnly,
    adminOrHumas,
    onlyVerified,
    adminOrSelf
 } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/beritas", optionalVerifyUser,getBeritas);

router.get("/beritas/:uuid",optionalVerifyUser, getBeritaById);

router.post("/beritas", verifyUser, adminOrHumas, onlyVerified, createBerita);

router.patch("/beritas/:uuid", verifyUser, adminOrHumas, onlyVerified, adminOrSelf, updateBerita);

router.delete("/beritas/:uuid", verifyUser,adminOrHumas, onlyVerified, adminOrSelf, deleteBerita);

router.patch("/beritas/:uuid/verify", verifyUser, adminOnly, onlyVerified, verifyBeritaByAdmin);

router.patch("/beritas/:uuid/reject", verifyUser, adminOnly, onlyVerified, rejectBeritaByAdmin);

export default router; 