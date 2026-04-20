import express from "express";
import {
  getUsers,
  getUserImage,
  getUserById,
  register,
  updateUsers,
  deleteUsers,
  verifyUserByAdmin,
  rejectUserByAdmin,
  cancelVerifyUser,
  cancelRejectUser
} from "../controllers/Users.js";
import { 
    verifyUser,
    adminOrKetuaForum,
    optionalVerifyUser,
    onlyVerified
 } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/users", verifyUser, getUsers);

router.get("/storage/anggota/:filename", optionalVerifyUser, getUserImage);

router.get("/users/:uuid", verifyUser, getUserById);

router.post("/register", register);

router.patch("/users/:uuid", verifyUser, onlyVerified, updateUsers);

router.delete("/users/:uuid", verifyUser, onlyVerified, deleteUsers);

router.patch(
  "/users/:uuid/verify", verifyUser, adminOrKetuaForum, onlyVerified, verifyUserByAdmin);

router.patch(
  "/users/:uuid/reject", verifyUser, adminOrKetuaForum, onlyVerified, rejectUserByAdmin);

router.patch("/users/:uuid/cancel-verify", verifyUser, adminOrKetuaForum, onlyVerified, cancelVerifyUser);

router.patch("/users/:uuid/cancel-reject", verifyUser, adminOrKetuaForum, onlyVerified, cancelRejectUser);

export default router;
