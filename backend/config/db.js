import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGO_URI_HORIZONTE_AZUL || "mongodb://localhost:27017/horizonteAzul";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Conectado a MongoDB");
  } catch (err) {
    console.error("❌ Error al conectar MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
