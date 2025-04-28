const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
app.use("/admin/students", require("./Routers/Students"));
// app.use("/admin/staff", require("./Routers/Staff")); // If you have Staff router also

mongoose.connect(process.env.MONGOURI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
