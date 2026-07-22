import app from "./app";
import dotenv from "dotenv";
import connectDB from "./config/Database";
import { seedAdmin } from "./config/seedAdmin";
import https from "https";
import fs from "fs";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();
    await seedAdmin();
    try {
        const domain = process.env.DOMAIN;
        const sslOptions = {
            key: fs.readFileSync(`/etc/letsencrypt/live/${domain}/privkey1.pem`),
            cert: fs.readFileSync(`/etc/letsencrypt/live/${domain}/fullchain1.pem`)
        };
        
        https.createServer(sslOptions, app).listen(PORT, () => {
            console.log(`Secure server is live at https://${domain}:${PORT}`);
        });
    } catch (error) {
        console.error("Failed to load SSL certificates. Falling back to HTTP or check file permissions:", error);
        
        app.listen(PORT, () => console.log(`HTTP server is live at http://localhost:${PORT}`));
    }
};

startServer();