import express from 'express';
import { fetchUser, login, register, updateProfile } from '../controllers/User.js';
import { isAuth } from '../middleware/Auth.js';
import upload from '../middleware/Multer.js';

const router = express.Router();

router.post("/register", register); 
router.post("/login", login);
router.post("/update-profile",isAuth, upload.single("profilepic"), updateProfile);
router.get("/fetch-user",isAuth, fetchUser);

export default router;