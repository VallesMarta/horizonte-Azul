import cors from "cors";

const corsMiddleware = cors({
  origin: "http://localhost:5173",
  credentials: true,
});

export default corsMiddleware;
