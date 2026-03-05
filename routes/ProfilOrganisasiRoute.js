import express from "express";
import {
    getProfilOrganisasis,
    createProfilOrganisasi,
    updateProfilOrganisasi,
    deleteProfilOrganisasi,
    getProfilOrganisasiImage
} from "../controllers/ProfilOrganisasi.js";

import {
    verifyUser,
    adminOrKetuaForum,
    optionalVerifyUser
} from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/profil-organisasi", optionalVerifyUser, getProfilOrganisasis);

router.get("/storage/profil/:filename", optionalVerifyUser, getProfilOrganisasiImage);

router.post("/profil-organisasi", verifyUser, adminOrKetuaForum, createProfilOrganisasi);

router.patch("/profil-organisasi/:uuid", verifyUser, adminOrKetuaForum, updateProfilOrganisasi);

router.delete("/profil-organisasi/:uuid", verifyUser, adminOrKetuaForum, deleteProfilOrganisasi);

export default router;