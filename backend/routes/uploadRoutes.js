import path from 'path';
import express from 'express';
import multer from 'multer';

const router = express.Router();

const storage = multer.diskStorage({
	  destination: (req, file, cb) => {
	cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
	cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const checkFileType = (file, cb) => {
	  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
	cb(null, true);
  } else {
	cb('Error: Images Only!');
  }
}

const upload = multer({
	storage,
	limits: { fileSize: 1000000 }, // Limit file size to 1MB
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb);
	},
});

router.post('/', upload.single('image'), (req, res) => {
	res.send({
		message: 'File uploaded successfully',
		image: `/${req.file.path}`,
	});
});

export default router;