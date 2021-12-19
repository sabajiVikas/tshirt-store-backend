// requiring packages
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

// express init
const app = express();

// database connection
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("DATABASE CONNECTED SUCCESSFULLY"))
  .catch((err) => console.error(err));

// middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());

// routes
app.get("/", (req, res) =>
  res.status(200).json({
    success: true,
    message: "welcome to tshirt-store backend",
  })
);

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

// port
const port = process.env.PORT || 8000;

// starting up server
app.listen(port, () =>
  console.log(`server is up & running at http://127.0.0.1:${port} ...`)
);
