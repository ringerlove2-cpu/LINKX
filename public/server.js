const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = process.env.PORT || 3000;

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {

    const ext =
      path.extname(file.originalname) || ".jpg";

    const filename =
      Date.now() +
      "-" +
      Math.random().toString(36).substring(2) +
      ext;

    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 10 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {

    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"));
    }

  }
});


app.use(express.static(
  path.join(__dirname, "public")
));


app.post(
  "/upload",
  upload.single("photo"),
  (req, res) => {

    if (!req.file) {

      return res.status(400).json({
        ok: false,
        error: "No photo received"
      });

    }

    res.json({
      ok: true,
      message: "Photo uploaded successfully"
    });

  }
);


app.listen(PORT, () => {

  console.log(
    `Server running at http://localhost:${PORT}`
  );

});
