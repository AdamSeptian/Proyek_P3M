import Users from "../models/UserModel.js";

export const verifyUser = async (req, res, next) => {
  if (!req.session.userUuid) {
    return res.status(401).json({ msg: "Silakan login terlebih dahulu" });
  }

  const user = await Users.findOne({
    where: {
      uuid: req.session.userUuid,
    },
    attributes: ["uuid", "role", "status"],
  });

  if (!user) {
    return res.status(404).json({ msg: "User tidak ditemukan" });
  }

  req.userUuid = user.uuid;
  req.role = user.role;
  req.status = user.status;

  next();
};

export const optionalVerifyUser = async (req, res, next) => {
  if (!req.session.userUuid) {
    return next();
  }

  const user = await Users.findOne({
    where: { uuid: req.session.userUuid },
    attributes: ["uuid", "role", "status"],
  });

  if (user) {
    req.userUuid = user.uuid;
    req.role = user.role;
    req.status = user.status;
  }

  next();
};

export const onlyVerified = (req, res, next) => {
  if (req.status !== "verified") {
    return res.status(403).json({
      msg: "Akun belum diverifikasi. Akses dibatasi.",
    });
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (req.role !== "admin") {
    return res.status(403).json({ msg: "Akses terlarang!" });
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

export const adminOrSelf = (req, res, next) => {
  if (req.role !== "admin" && agenda.users_uuid !== req.userUuid) {
    return res.status(403).json({ msg: "Akses terlarang!" });
  }
  next();
};