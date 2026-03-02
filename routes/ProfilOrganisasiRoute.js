import express from "express";
import {
    getProfilOrganisasis,
    createProfilOrganisasi,
    updateProfilOrganisasi,
    deleteProfilOrganisasi
} from "../controllers/ProfilOrganisasi.js";

import {
    verifyUser,
    adminOrKetuaForum
} from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/profil-organisasi", getProfilOrganisasis);

router.post("/profil-organisasi", verifyUser, adminOrKetuaForum, createProfilOrganisasi);

router.patch("/profil-organisasi/:uuid", verifyUser, adminOrKetuaForum, updateProfilOrganisasi);

router.delete("/profil-organisasi/:uuid", verifyUser, adminOrKetuaForum, deleteProfilOrganisasi);

export default router;