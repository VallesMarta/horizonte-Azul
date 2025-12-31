import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.acces_token;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!token) {
    return res.status(401).json({ ok: false, error: "No autorizado" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.session = { user: data };
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, error: "Token inválido" });
  }
};

export default authMiddleware;
