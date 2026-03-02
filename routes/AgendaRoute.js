import express from "express";
import {
    getAgendas,
    getAgendaByUuid,
    createAgenda,
    updateAgenda,
    deleteAgenda,
    verifyAgendaByAdmin,
    rejectAgendaByAdmin
} from "../controllers/Agenda.js";
import { 
    verifyUser,
    optionalVerifyUser,
    adminOrHumas,
    onlyVerified,
    adminOnly
 } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/agendas", optionalVerifyUser, getAgendas);

router.get("/agendas/:uuid", optionalVerifyUser, getAgendaByUuid);

router.post("/agendas", verifyUser, adminOrHumas, onlyVerified, createAgenda);

router.patch("/agendas/:uuid", verifyUser, adminOrHumas, onlyVerified, updateAgenda);

router.delete("/agendas/:uuid", verifyUser, adminOrHumas, onlyVerified, deleteAgenda);

router.patch("/agendas/:uuid/verify", verifyUser, adminOnly, onlyVerified, verifyAgendaByAdmin);

router.patch("/agendas/:uuid/reject", verifyUser, adminOnly, onlyVerified, rejectAgendaByAdmin);

export default router;