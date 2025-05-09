// index.js

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");

// connect to DB and Cloudinary before anything else
require("./config/database").connectDb();
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

// bring in your user routes
const userRoutes = require("./routes/user");

const app = express();

// 1) CORS (including OPTIONS for preflight)
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// 2) File upload middleware (multipart/form-data) – must come before body parsers
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// 3) JSON + URL-encoded parsers, with rawBody capture for JSON
app.use(
  express.json({
    verify: (req, res, buf) => {
      // store the raw text for debugging
      req.rawBody = buf.toString();
    },
  })
);
app.use(express.urlencoded({ extended: true }));

// 4) Cookie parser
app.use(cookieParser());

// 5) Debugging middleware: inspect exactly what JSON arrived
app.use((req, res, next) => {
  console.log("💥 Raw request body:", req.rawBody);
  next();
});

// 6) Health check
app.get("/", (req, res) => {
  res.send("Hello Jee");
});

// 7) API routes
app.use("/api/v1", userRoutes);

app.use(express.static("./frontend/build"));
app.get("*", (req, res) => {
res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
    });

// 8) Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});
