const { verifyAccessToken } = require('../service/auth');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No access token provided." });
  }
  const token = authHeader.split(" ")[1];
  try {
    const user = verifyAccessToken(token); // this should return decoded user info
    req.customer = user; // attach to request
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ error: "Invalid or expired access token." });
  }
}

module.exports = {
  authMiddleware,
}