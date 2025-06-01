const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const appRoutes = require("./app/routes/app.routes");
require("dotenv").config()

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", appRoutes);
app.use("/", express.static(path.join(__dirname, "public", "uploads")));
app.get("/", (req , res) => {
  res.send("Hello")
});

mongoose
  .connect(process.env.MONGO_DB || "mongodb+srv://study:0123456789@cluster0.6ivygrg.mongodb.net")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
