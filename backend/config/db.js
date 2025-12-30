import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/horizonteAzul");
    console.log("✅ Conectado a MongoDB");
  } catch (err) {
    console.error("❌ Error al conectar MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
