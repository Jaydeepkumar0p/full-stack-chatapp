import express from 'express';
import { Logout, signIn, signUp, updateProfile, checkAuth } from '../controllers/auth.controllers.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// ✅ Use lowercase route names for REST best practices
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/logout", Logout);

router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

export default router;
