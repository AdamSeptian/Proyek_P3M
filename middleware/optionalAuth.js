// middleware/OptionalAuth.js
export const optionalVerifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // Tidak ada token, lanjut sebagai guest
    req.role = null;
    req.userUuid = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.SESS_SECRET);
    req.role = decoded.role;
    req.userUuid = decoded.uuid;
    next();
  } catch (error) {
    // Token invalid, tetap lanjut sebagai guest
    req.role = null;
    req.userUuid = null;
    next();
  }
};