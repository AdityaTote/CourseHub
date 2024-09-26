import multer from "multer";
import path from "path"

const filePath = path.join(__dirname, "../../public/temp");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, filePath);
  },
  filename: function (req, file, cb) {
    const filename: string = Date.now() + "-" + file.originalname;
    cb(null, filename);
  },
});

export const upload = multer({ storage: storage });
