import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import initializeDatabase from "./config/db.connect.js";
import { seedLeads } from "./seed/seedLeads.js";

import leadRoutes from "./routes/leadRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import commentRoutes from "./routes/commentRoutes.js"
import reportRoutes from "./routes/reportRoutes.js"

dotenv.config();

// middleware
const app = express();
app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

/* SERVER START  */
async function startServer() {
  try {
    await initializeDatabase();
    // await seedLeads();

    // Default Route.
    app.get("/", (req, res) => {
      res.send("🚀 Anvaya CRM Backend Running"); 
    });

    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error("Error starting server:", error);
  }
}
startServer();

// routes
app.use("/leads", leadRoutes);
app.use("/agents", agentRoutes);
app.use("/", commentRoutes);
app.use("/reports", reportRoutes);

app.get("/test", (req, res) => {
  res.json({
    mongo: process.env.MONGODB ? "FOUND" : "MISSING",
  });
});
