import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/AuthRoutes";
import appointmentRoutes from "./routes/AppointmentRoutes";
import consultRoutes from "./routes/ConsultRoutes";
import articleRoutes from "./routes/ArticleRoutes";
import feedbackRoutes from "./routes/FeedbackRoutes";
import doctorRoutes from "./routes/DoctorRoutes";
import patientRoutes from "./routes/PatientRoutes";
import adminRoutes from "./routes/AdminRoutes";
import summaryRoutes from "./routes/SummaryRoutes";
import calendarRoutes from "./routes/CalendarRoutes";
import transactionRoutes from "./routes/TransactionRoutes";

dotenv.config();

const app: Application = express();

const allowedOrigins = [
  "http://localhost:3000",
  "https://wellnestjs.vercel.app"
];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// }));
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));

app.get("/api/v1/", (req, res) => {
  res.send("Welcome to the WellNest API");
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/doctor", doctorRoutes);
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/appointment", appointmentRoutes);
app.use("/api/v1/consult", consultRoutes);
app.use("/api/v1/article", articleRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/summary", summaryRoutes);
app.use("/api/v1/calendar", calendarRoutes);
app.use("/api/v1/transaction", transactionRoutes);

export default app;