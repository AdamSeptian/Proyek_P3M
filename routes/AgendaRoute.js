import express from "express";
import {
    getAgendas,
    getAgendaImage,
    getAgendaByUuid,
    createAgenda,
    updateAgenda,
    deleteAgenda,
    verifyAgendaByAdmin,
    rejectAgendaByAdmin,
} from "../controllers/Agenda.js";
import { 
    verifyUser,
    optionalVerifyUser,
    adminOrHumas,
    onlyVerified,
    adminOnly,
    adminOrSelf
 } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/agendas", optionalVerifyUser, getAgendas);

router.get("/storage/agenda/:filename", optionalVerifyUser, getAgendaImage);

router.get("/agendas/:uuid", optionalVerifyUser, getAgendaByUuid);

router.post("/agendas", verifyUser, adminOrHumas, onlyVerified, createAgenda);

router.patch("/agendas/:uuid", verifyUser, adminOrHumas, onlyVerified,adminOrSelf, updateAgenda);

router.delete("/agendas/:uuid", verifyUser, adminOrHumas, onlyVerified, adminOrSelf, deleteAgenda);

router.patch("/agendas/:uuid/verify", verifyUser, adminOnly, onlyVerified, verifyAgendaByAdmin);

router.patch("/agendas/:uuid/reject", verifyUser, adminOnly, onlyVerified, rejectAgendaByAdmin);

export default router;