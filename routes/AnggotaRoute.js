import express from "express";
import {
  getAnggotas,
  getAnggotaById,
  createAnggota,
  updateAnggota,
  deleteAnggota,
} from "../controllers/Anggota.js";
import { 
    verifyUser,
    adminOrAnggota
 } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/anggotas", getAnggotas);

router.get("/anggotas/:uuid", getAnggotaById);

router.post("/anggotas", createAnggota);

router.patch("/anggotas/:uuid",verifyUser,adminOrAnggota, updateAnggota);

router.delete("/anggotas/:uuid", verifyUser,adminOrAnggota, deleteAnggota);

export default router;