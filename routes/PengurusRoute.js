import express from "express";
import {
    getPenguruses,
    getPengurusByUuid,
    createPengurus,
    updatePengurus,
    deletePengurus
} from "../controllers/Pengurus.js";
import {
    verifyUser,
    adminOnly
} from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/pengurus", getPenguruses);

router.get("/pengurus/:uuid", getPengurusByUuid);

router.post("/pengurus", verifyUser, adminOnly, createPengurus);

router.patch("/pengurus/:uuid", verifyUser, adminOnly, updatePengurus);

router.delete("/pengurus/:uuid", verifyUser, adminOnly, deletePengurus);

export default router;