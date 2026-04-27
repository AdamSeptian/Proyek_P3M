import express from "express";
import {
    getProfilOrganisasis,
    createProfilOrganisasi,
    updateProfilOrganisasi,
    deleteProfilOrganisasi,
    getProfilOrganisasiImage,
    verifyProfilOrganisasi,
    rejectProfilOrganisasi,
    cancelVerifyProfilOrganisasi,
    cancelRejectProfilOrganisasi
} from "../controllers/ProfilOrganisasi.js";

import {
    verifyUser,
    adminOrKetuaForum,
    optionalVerifyUser,
    adminOrHumas,
    onlyVerified
} from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/profil-organisasi", optionalVerifyUser, getProfilOrganisasis);

router.get("/storage/profil/:filename", optionalVerifyUser, getProfilOrganisasiImage);

router.post("/profil-organisasi", verifyUser, adminOrHumas, onlyVerified, createProfilOrganisasi);

router.patch("/profil-organisasi/:uuid", verifyUser, adminOrHumas, onlyVerified, updateProfilOrganisasi);

router.delete("/profil-organisasi/:uuid", verifyUser, adminOrHumas, onlyVerified, deleteProfilOrganisasi);

router.patch("/profil-organisasi/:uuid/verify", verifyUser, adminOrKetuaForum, onlyVerified, verifyProfilOrganisasi);

router.patch("/profil-organisasi/:uuid/reject", verifyUser, adminOrKetuaForum, onlyVerified, rejectProfilOrganisasi);

router.patch("/profil-organisasi/:uuid/cancel-verify", verifyUser, adminOrKetuaForum, onlyVerified, cancelVerifyProfilOrganisasi);

router.patch("/profil-organisasi/:uuid/cancel-reject", verifyUser, adminOrKetuaForum, onlyVerified, cancelRejectProfilOrganisasi);

export default router;