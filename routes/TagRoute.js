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
    onlyVerified
} from "../middleware/AuthUser.js"

const router = express.Router();

router.get('/tag', optionalVerifyUser, getAllTag);
router.get('/tag/:uuid', optionalVerifyUser, getTagById);
router.get('/tag/:uuid/berita', getBeritaByTag);
router.post('/tag', verifyUser, onlyVerified, adminOnly, createTag);
router.patch('/tag/:uuid', verifyUser, onlyVerified, adminOnly, updateTag);
router.delete('/tag/:uuid', verifyUser, onlyVerified, adminOnly, deleteTag);

export default router;