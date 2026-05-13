import Users from "../models/UserModel.js";
import jwt from "jsonwebtoken";

// --- HELPER UNTUK VERIFIKASI TOKEN ---
// Fungsi internal untuk mengecek token dari header
const decodeToken = (req) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer <TOKEN>
    if (!token) return null;

    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        return null;
    }
};

// --- MIDDLEWARE UTAMA ---

export const verifyUser = async (req, res, next) => {
    // 1. Coba ambil data dari JWT dulu (Prioritas)
    const decoded = decodeToken(req);
    
    // 2. Jika tidak ada JWT, coba cek Session (Fallback/Cadangan)
    const userUuid = decoded ? decoded.uuid : req.session.userUuid;

    if (!userUuid) {
        return res.status(401).json({ msg: "Silakan login terlebih dahulu (Token/Session tidak ditemukan)" });
    }

    try {
        const user = await Users.findOne({
            where: { uuid: userUuid },
            attributes: ["uuid", "role", "status"],
        });

        if (!user) {
            if (req.session) req.session.destroy();
            return res.status(404).json({ msg: "User tidak ditemukan." });
        }

        // Simpan data ke object request agar bisa dipakai middleware selanjutnya & controller
        req.userUuid = user.uuid;
        req.role = user.role;
        req.status = user.status;

        next();
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

export const optionalVerifyUser = async (req, res, next) => {
    const decoded = decodeToken(req);
    const userUuid = decoded ? decoded.uuid : req.session.userUuid;

    if (!userUuid) return next();

    try {
        const user = await Users.findOne({
            where: { uuid: userUuid },
            attributes: ["uuid", "role", "status"],
        });

        if (user) {
            req.userUuid = user.uuid;
            req.role = user.role;
            req.status = user.status;
        }
        next();
    } catch (error) {
        next();
    }
};

// --- MIDDLEWARE ROLE & STATUS (LOGIKA TETAP SAMA) ---

export const onlyVerified = (req, res, next) => {
    if (req.status !== "verified") {
        return res.status(403).json({ msg: "Akun belum diverifikasi. Akses dibatasi." });
    }
    next();
};

export const adminOnly = (req, res, next) => {
    if (req.role !== "admin") {
        return res.status(403).json({ msg: "Akses terlarang! Khusus Admin." });
    }
    next();
};

export const adminOrHumas = (req, res, next) => {
    if (req.role !== "admin" && req.role !== "humas") {
        return res.status(403).json({ msg: "Akses terlarang!" });
    }
    next();
};

export const adminOrKetuaForum = (req, res, next) => {
    if (req.role !== "admin" && req.role !== "ketua_forum") {
        return res.status(403).json({ msg: "Akses terlarang!" });
    }
    next();
};

export const adminOrAnggota = (req, res, next) => {
    if (req.role !== "admin" && req.role !== "anggota") {
        return res.status(403).json({ msg: "Akses terlarang!" });
    }
    next();
};

export const adminOrSelf = (Model) => async (req, res, next) => {
    try {
        const data = await Model.findOne({ where: { uuid: req.params.uuid } });
        if (!data) return res.status(404).json({ msg: "Data tidak ditemukan" });

        // Cek apakah admin atau pemilik data (relasi users_uuid)
        if (req.role === "admin" || req.userUuid === data.users_uuid) {
            req.tempData = data;
            next();
        } else {
            return res.status(403).json({ msg: "Akses terlarang" });
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};