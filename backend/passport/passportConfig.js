import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from './models/User.model.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/auth/google/callback" // URL to handle the callback after Google login
},
async (accessToken, refreshToken, profile, done) => {
  try {
    // Check if user already exists by Google ID
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      // Create a new user if not exists
      user = new User({
        googleId: profile.id,
        email: profile.emails[0].value,
        name: profile.displayName,
        isVerified: true // Consider Google-authenticated users as verified
      });
      await user.save();
    }

    // User found or created, return user object
    return done(null, user);
  } catch (error) {
    return done(error, null);
  }
}));

// Serialization & Deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

export default passport;
