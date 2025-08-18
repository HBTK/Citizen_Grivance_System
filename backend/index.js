const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complainRoutes");
const sessionMiddleware = require("./middleware/sessionMiddleware");
const connectDB = require("./connection/db");
const officerRoutes = require("./routes/officerRoutes");
const admin = require("./models/admin");
const adminRoutes = require("./routes/adminRoutes");
const sessionRoutes = require("./routes/sessionRoutes");
const logoutRoutes = require("./routes/logoutRoute");
const app = express();
app.use(express.json());
app.set("trust proxy", 1);
connectDB();

app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000",
  "https://citizen-grivance-system.vercel.app",
  "https://citizen-grivance-system.onrender.com",
  "https://citizen-grivevance-system.vercel.app",
  "https://main.d3o0le9zmytcdz.amplifyapp.com",
  "https://main.d3x5934421hvg.amplifyapp.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);


app.use(sessionMiddleware);

//user
app.use("/api/auth", authRoutes);

//complaints
app.use("/api/complaints", complaintRoutes);

//officer
app.use("/api/officer", officerRoutes);

//admin
app.use("/api/admin", adminRoutes);

//session
app.use("/api", sessionRoutes);

app.use('/api', logoutRoutes);

app.get("/", (req, res) => res.send("Backend Running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
