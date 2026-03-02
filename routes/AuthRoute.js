import express from "express";
import {
  Login,
    Me,
    Logout
} from "../controllers/Auth.js";

const router = express.Router();

router.post("/login", Login);

router.get("/me", Me);

router.delete("/logout", Logout);

export default router;