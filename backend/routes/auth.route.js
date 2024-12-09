import express  from 'express';
import { forgotPassword, login, logout, resetPassword, signup, verifyEmail ,checkAuth} from '../controllers/auth.controller.js';
import { verifyToken } from '../middlware/verifieToken.js';
import passport from 'passport';


const router = express.Router();

router.get("/check-auth" , verifyToken , checkAuth)

router.post("/signup" ,signup);

router.post("/login" ,login);

router.post("/logout" , logout);

router.post("/verify-email" , verifyEmail)


router.post("/forgot-password" , forgotPassword)
router.post("/reset-password/:token" , resetPassword)


router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google Callback Route
router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    (req, res) => {
      // Generate a token for the user
      const token = generateToken(req.user._id); // Assuming generateToken is a utility to generate JWT tokens
  
      // Set the token in a cookie or send it back to the frontend
      res.cookie('tokenauth ', token, { httpOnly: true });
      res.redirect(`${process.env.CLIENT_URL}/dashboard`);
    }
  );
  










export default router 