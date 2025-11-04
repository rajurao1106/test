import express from 'express';
// Use named imports for controller functions, and include .js extension
import { signup, login, forgotPassword, resetPassword } from '../controllers/authController.js'; 

const router = express.Router();

// Define routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
