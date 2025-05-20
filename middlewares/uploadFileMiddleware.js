import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

export const uploadFileMiddleware = (req, res, next) => {
  upload.single("image")(req, res, function (err) {
    if (err) {
      return res.status(400).json({ message: "Error uploading file" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "File tidak ditemukan" });
    }

    req.body.image_url = `/uploads/${req.file.filename}`;
    next();
  });
};
