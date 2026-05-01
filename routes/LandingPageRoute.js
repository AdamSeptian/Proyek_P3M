import express from "express";
import {
    getLandingPage,
    updateLandingData,
    uploadHeroImage,
    setupLandingPage,
    getLandingImage // Import fungsi baru
} from "../controllers/LandingPage.js";
import { 
    verifyUser,
    optionalVerifyUser,
    adminOnly,
    onlyVerified,
} from "../middleware/AuthUser.js";

const router = express.Router();

// Endpoint untuk ambil gambar secara aman
router.get("/storage/landing_page/:folder/:filename", optionalVerifyUser, getLandingImage);

router.get("/landing", optionalVerifyUser, getLandingPage);
router.post("/landing/setup", verifyUser, adminOnly, onlyVerified, setupLandingPage);
router.patch("/landing/update", verifyUser, adminOnly, onlyVerified, updateLandingData);
router.post("/landing/upload-hero", verifyUser, adminOnly, onlyVerified, uploadHeroImage);

export default router;