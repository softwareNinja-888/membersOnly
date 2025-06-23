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
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  // Confirm Password
  // READ ON CUSTOM validator
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.password)
    .withMessage('Passwords do not match'),

  // Type
  body('type')
    .isIn(['member', 'admin'])
    .withMessage('Invalid user type selected')
];


exports.home = (req,res)=>{
	res.render('index',{
		errors:{}
	})
}



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
          const hashedPassword = await bcrypt.hash(req.body.password,10)
          formData.password = hashedPassword;
		  await db.addUser(formData)
		  res.send('NIce')
		  // res.redirect('/index',{
		  // 	text:'Sign up complete!'
		  // });
		} catch (err) {
		  console.error(err);
		  res.status(500).send("Error updating the room.");
		}

	}
]