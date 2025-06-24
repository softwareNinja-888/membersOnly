const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db/queries');
const bcrypt = require('bcrypt')

const customFields = {
  usernameField: 'email',
  passwordField: 'pw'
};

passport.use(new LocalStrategy(customFields,
  async (email, password, done) => {

    try {
      const user = await db.getUser(email);

      if (!user) {
        return done(null, false,{ message: "Email/username not found" });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return done(null, false, { message: "Incorrect password" })
      }
      return done(null, user)

    } catch (err) {
      console.error('Strategy error:', err);
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await db.getUserId(userId);
    done(null, user);
  } catch (err) {
    done(err);
  }
});


