import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },

  filename(req, file, cb) {
   
    const cleanName = path
      .basename(file.originalname)
      .replace(/^._/, "");

    const ext = path.extname(cleanName).toLowerCase();

    cb(null, `profile-${Date.now()}${ext}`);
  },
});

// filter only images
const fileFilter = (req, file, cb) => {
  if (file.originalname.startsWith("._")) {
    return cb(null, false); 
  }

  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files allowed"), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});

export default upload;