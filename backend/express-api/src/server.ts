import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/Database";
import { seedAdmin } from "./config/seedAdmin";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    await seedAdmin();
    app.listen(PORT, () => console.log(`server is live at http://localhost:${PORT}`));
};

startServer();