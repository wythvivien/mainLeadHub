import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/userModel.js";

// Passport.js Authentication Middleware
export default function (passport) {
  // Configuration of Google OAuth2 strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.CLIENT_ID, // Google Oauth Client ID
        clientSecret: process.env.CLIENT_SECRET, // Google Oauth Client Secret
        callbackURL: "/auth/google/callback", // Callback URL for Google Oauth
        scope: [
          // Scopes for the APIs
          "profile", // Authenticated User's profile information
          "email", // Authenticated User's email address
          "https://mail.google.com/", // Access to user's Gmail
          "https://www.googleapis.com/auth/contacts.other.readonly", // Access to Google Account's other contacts
          "https://www.googleapis.com/auth/userinfo.profile",
        ],
        accessType: "offline", // Request a refresh token
      },
      // Callback function for handling authentication
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Find user in the database based on Google ID
          let user = await User.findOne({ googleId: profile.id });
          // If user does not exist create a new user
          if (!user) {
            user = new User({
              googleId: profile.id,
              displayName: profile.name.givenName,
              lastName: profile.name.familyName,
              email: profile.emails[0].value,
              image: profile.photos[0].value,
              accessToken, // Save the access token
            });

            await user.save(); // Save the new user to the database
          } else {
            // If user exists, update the new access token
            user.accessToken = accessToken;
            await user.save(); // Save the updated information to the database
          }

          // Call the done callback to indicate completion of authentication
          return done(null, user);
        } catch (error) {
          // Log of errors
          console.log(error);
        }
      }
    )
  );
  // Serialize the user to store in the session
  passport.serializeUser((user, done) => {
    done(null, user._id); // Storing the user's _id in the session
  });
  // Deserialize user to retrieve from the session
  passport.deserializeUser(async (id, done) => {
    try {
      // Find user n the database
      const user = await User.findById(id);
      // Pass the user object to done callback
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}
