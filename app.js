require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const session = require('express-session');
const pgSession = require("connect-pg-simple")(session);
const mainRouter = require('./routes/mainRouter')
const passport = require('passport');



const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');

const app = express();

app.set("view engine", 'ejs')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(
  session({
    store: new pgSession({
      pool: pool,               
      tableName: "session",   
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, 
    },
  })
);

app.use(passport.initialize())
app.use(passport.session());


/**
 * -------------- ROUTES ----------------
 */

app.use('/',mainRouter);


/**
 * -------------- SERVER ----------------
 */



// Server listens on http://localhost:3000
const PORT = process.env.PORT
app.listen(PORT,()=>console.log(`Listening on PORT: ${PORT}`));