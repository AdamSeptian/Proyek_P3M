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
    adminOrKetuaForum
} from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/penguruses", getPenguruses);

router.get("/penguruses/:uuid", getPengurusByUuid);

router.post("/penguruses", verifyUser, adminOrKetuaForum, createPengurus);

router.patch("/penguruses/:uuid", verifyUser, adminOrKetuaForum, updatePengurus);

router.delete("/penguruses/:uuid", verifyUser, adminOrKetuaForum, deletePengurus);

export default router;