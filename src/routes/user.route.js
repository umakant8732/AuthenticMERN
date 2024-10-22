import express from "express";
import multer from "multer";
import { loginUser, registerUser, logoutUser, updateUserProfile, getUserProfile, testingAPI } from "../controller/user.controller.js";
import { protect } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './uploads');
  },
  filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
});

// Multer upload instance
const upload = multer({ storage: storage });

// Routes with file upload handling
authRouter.post('/loginUser', loginUser);
authRouter.post('/registerUser', registerUser);
authRouter.post('/logoutUser', logoutUser);
authRouter.put('/profile', protect, upload.single('profilePic'), updateUserProfile); // Handle single file upload
authRouter.get('/getprofile', protect, getUserProfile);
authRouter.get('/testingApi', testingAPI);

export default authRouter;
