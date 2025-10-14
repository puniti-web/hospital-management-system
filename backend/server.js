const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./db");

const authRoutes = require("./routes/authRoutes");
//const appointmentRoutes = require("./routes/appointmentRoutes");
//const billingRoutes = require("./routes/billingRoutes");
//const wardRoutes = require("./routes/wardRoutes");
//app.use("/api/wards", wardRoutes);


const app = express();
app.use(cors());
app.use(express.json());


// health
app.get("/health/db", (req, res) => {
  db.query("SELECT 1", (err) => {
    if (err) return res.status(500).json({ db: "down", error: err.message });
    res.json({ db: "up" });
  });
});

// API routes
app.use("/api/auth", authRoutes);
// app.use("/api/appointments", appointmentRoutes);
// app.use("/api/billing", billingRoutes);
const appointmentRoutes = require("./routes/appointmentRoutes");
const billingRoutes = require("./routes/billingRoutes");
const wardRoutes = require("./routes/wardRoutes");

app.use("/api/appointments", appointmentRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/wards", wardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
