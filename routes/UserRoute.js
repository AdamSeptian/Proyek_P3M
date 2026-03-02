import express from "express";
import {
  getUsers,
  getUserById,
  register,
  updateUsers,
  deleteUsers,
  verifyUserByAdmin,
  rejectUserByAdmin
} from "../controllers/Users.js";
import { 
    verifyUser,
    adminOrKetuaForum,
    onlyVerified
 } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/users", verifyUser, getUsers);

router.get("/users/:uuid", verifyUser, getUserById);

router.post("/register", register);

router.patch("/users/:uuid", verifyUser, onlyVerified, updateUsers);

router.delete("/users/:uuid", verifyUser, onlyVerified, deleteUsers);

router.patch(
  "/users/:uuid/verify", verifyUser, adminOrKetuaForum, onlyVerified, verifyUserByAdmin);

router.patch(
  "/users/:uuid/reject", verifyUser, adminOrKetuaForum, onlyVerified, rejectUserByAdmin);

export default router;
