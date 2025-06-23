const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const mongoose = require("mongoose");
const User = require("../models/User"); // Import User model

require("dotenv").config();

console.log("Registering Passport Strategies...");

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:4000/api/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // 1. Tìm theo googleId
          let user = await User.findOne({ googleId: profile.id });

          // 2. Nếu chưa có, tìm theo email để “link”
          if (!user) {
            const email = profile.emails?.[0]?.value;
            if (!email) return done(new Error("Google không trả email"), null);

            user = await User.findOne({ email });
            if (user) {
              user.googleId = profile.id;
              user.provider = "google";
              user.avatar = profile.photos?.[0]?.value || user.avatar;
              user.isVerified = true;
              await user.save();
            }
          }

          // 3. Nếu chưa có, tạo mới
          if (!user) {
            user = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0].value,
              provider: "google",
              isVerified: true,
            });
            await user.save();
          }
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
}

// Facebook Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:4000/api/auth/facebook/callback",
        profileFields: ["id", "displayName", "emails", "photos"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("Facebook không trả về email"), null);
          }

          // 1. Tìm theo facebookId nếu có field này:
          let user = await User.findOne({ facebookId: profile.id });

          // 2. Nếu chưa có, tìm theo email để link
          if (!user) {
            user = await User.findOne({ email });
            if (user) {
              user.facebookId = profile.id;
              user.provider = "facebook";
              user.avatar = profile.photos?.[0]?.value || user.avatar;
              user.isVerified = true;
              await user.save();
            }
          }

          // 3. Nếu vẫn chưa có, tạo mới
          if (!user) {
            user = new User({
              id: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.avatar,
              provider: "facebook",
              isVerified: true,
            });
            await user.save();
          }
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
}

// Serialize & Deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

console.log("✅ Passport Strategies Registered!");

module.exports = passport;
