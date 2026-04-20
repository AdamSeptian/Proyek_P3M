import express from "express";
import {
    getAllTag,
    getTagById,
    getBeritaByTag,
    createTag,
    updateTag,
    deleteTag
} from "../controllers/Tag.js";

import {
    verifyUser,
    adminOnly,
    optionalVerifyUser,
    onlyVerified,
    adminOrHumas
} from "../middleware/AuthUser.js"

const router = express.Router();

router.get('/tag', optionalVerifyUser, getAllTag);
router.get('/tag/:uuid', optionalVerifyUser, getTagById);
router.get('/tag/:uuid/berita', getBeritaByTag);
router.post('/tag', verifyUser, onlyVerified, adminOrHumas, createTag);
router.patch('/tag/:uuid', verifyUser, onlyVerified, adminOrHumas, updateTag);
router.delete('/tag/:uuid', verifyUser, onlyVerified, adminOrHumas, deleteTag);

export default router;