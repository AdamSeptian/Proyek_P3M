import Laporans from "../models/LaporanModel.js";

export const getLaporans = async (req, res) => {
      try {
         let whereCondition = {};
     
         if (req.role === "admin") {
           whereCondition = {};
         } else if (req.role === "ketua_forum") {
           whereCondition = {
             [Op.or]: [
               { status: "verified" },
               { users_uuid: req.userUuid }
             ]
           };
         } else {
           whereCondition = { status: "verified" };
         }
     
         const response = await Laporans.findAll({
           where: whereCondition,
           attributes: ["uuid", "keterangan", "tuan_rumah", "status", "jadwal", "createdAt"],
           include: [{
             model: Users,
             attributes: ["username", "role"]
           }]
         });
     
         res.status(200).json(response);
       } catch (error) {
         res.status(500).json({ msg: error.message });
       }
}

export const getLaporanByUuid = async (req, res) => {}

export const createLaporan = async (req, res) => {}

export const updateLaporan = async (req, res) => {}

export const deleteLaporan = async (req, res) => {}