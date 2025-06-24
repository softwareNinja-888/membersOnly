const { body, validationResult } = require("express-validator");
const db = require('../db/queries')
const bcrypt = require('bcrypt')

const validateUser = [
  // First Name
  body('firstName')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name should be at least 2 characters and not more than 50')
    .matches(/^[\w\s\-\/&()]+$/)
    .withMessage('First name contains invalid characters')
    .trim()
    .escape(),

  // Last Name
  body('lastName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name should be at least 2 characters and not more than 50')
    .matches(/^[\w\s\-\/&()]+$/)
    .withMessage('Last name contains invalid characters')
    .trim()
    .escape(),

  // Email
  body('email')
    .isEmail()
    .withMessage('Invalid email address')
    .normalizeEmail(),

  // Password
  body('pw')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  // Confirm Password
  // READ ON CUSTOM validator
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.pw)
    .withMessage('Passwords do not match'),
];

const validatePasswordJoin = [
  // Password
  body('pw')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
]

exports.home = (req,res)=>{
	res.render('index',{
		errors:{}
	})
}

exports.signUpPage = (req,res)=>{
  res.render('signUp',{
    errors:{}
  })
}
exports.joinPage = (req,res)=>{
  console.log('Join Home:',req.user)
  res.render('join',{
    errors:{},
  })
}


exports.loginPage = (req,res)=>{
  res.render('login',{
    errors:{}
  })
}

exports.logout = (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
}


exports.joinSubmit = [
  validatePasswordJoin,
  async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
      return res.status(400).render('index',{
        errors: errors.array(),
      })
    }
    try {
      // CHECK IF PASSWORD IS CORRECT
      const memberHash = await db.getHash('Member')
      const match = await bcrypt.compare(req.body.pw, memberHash.hashed_code);

      if (!match){
        res.redirect('join')
      } else{
        await db.setUserAsMember(req.user.id,memberHash.id)
        res.redirect('/')
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Error updating the room.");
    }

  }
]

exports.signUp  =  [
	validateUser,
	async (req, res) => {
		const errors = validationResult(req)
		if(!errors.isEmpty()){
			return res.status(400).render('index',{
				errors: errors.array(),
				oldInput:req.body
			})
		}
	  try {
      const formData = req.body;
      const hashedPassword = await bcrypt.hash(req.body.pw,10)
      formData.pw = hashedPassword;
		  await db.addUser(formData)
		  res.redirect('/join');
		} catch (err) {
		  console.error(err);
		  res.status(500).send("Error Signing up");
		}

	}
]