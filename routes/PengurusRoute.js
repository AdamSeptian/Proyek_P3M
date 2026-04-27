import express from "express";
import {
    getPenguruses,
    getPengurusByUuid,
    createPengurus,
    updatePengurus,
    deletePengurus,
    getPengurusImage
} from "../controllers/Pengurus.js";
import {
    verifyUser,
    adminOnly,
    onlyVerified,
    adminOrKetuaForum,
    optionalVerifyUser
} from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/pengurus", getPenguruses);

router.get("/storage/pengurus/:filename", optionalVerifyUser, getPengurusImage);

router.get("/pengurus/:uuid", verifyUser, adminOrKetuaForum, onlyVerified, getPengurusByUuid);

router.post("/pengurus", verifyUser, adminOrKetuaForum, onlyVerified, createPengurus);

router.patch("/pengurus/:uuid", verifyUser, adminOrKetuaForum, onlyVerified, updatePengurus);

router.delete("/pengurus/:uuid", verifyUser, adminOrKetuaForum, onlyVerified, deletePengurus);

export default router;