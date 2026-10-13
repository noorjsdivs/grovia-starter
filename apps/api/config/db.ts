import mongoose from "mongoose";

const RETRY_MS = 5_000;
const MAX_RETRY_MS = 30_000;

/**
 * Connects to MongoDB and keeps trying.
 *
 * The API stays up while the database is unreachable: `readinessGate` answers
 * every data request with a JSON 503 until the connection is back, and the
 * driver reconnects on its own once it exists. A missing `MONGO_URI` is the
 * only thing that still stops the process, because nothing can recover from it.
 */
const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MongoDB: MONGO_URI is not defined in the root .env");
    process.exit(1);
  }

  mongoose.connection.on("disconnected", () => console.warn("MongoDB: disconnected — requests return 503 until it is back"));
  mongoose.connection.on("reconnected", () => console.log("MongoDB: reconnected"));
  mongoose.connection.on("error", (error) => console.error("MongoDB: connection error:", error.message));

  let delay = RETRY_MS;
  for (;;) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 8_000,
        heartbeatFrequencyMS: 10_000,
        /* Enough sockets for a busy checkout, a couple kept warm, idle ones released. */
        maxPoolSize: 20,
        minPoolSize: 2,
        maxIdleTimeMS: 60_000,
        socketTimeoutMS: 45_000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`MongoDB Connection Error: ${message} — retrying in ${delay / 1000}s`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, MAX_RETRY_MS);
    }
  }
};

export default connectDB;
