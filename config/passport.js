const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../db/queries');

const customFields = {
  usernameField: 'uname',
  passwordField: 'pw'
};

passport.use(new LocalStrategy(customFields,
  async (username, password, done) => {
    try {
      const user = await db.getUser(username);

      if (!user) {
        return done(null, false);
      }

      const { hash, salt } = user;
      const isValid = validPassword(password, hash, salt);

      if (isValid) {
        return done(null, user);
      } else {
        return done(null, false);
      }

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
