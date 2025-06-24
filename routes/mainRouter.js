const router = require('express').Router()
const mainController = require('../controllers/mainController')
const passport = require('passport')

function ensureLoggedIn(req,res,next){
    console.log('From loggedin:',req.isAuthenticated())
    if (req.isAuthenticated()) return next();
    res.redirect('/login')

}

router.get("/",mainController.home)
router.get("/signUp",mainController.signUpPage)
router.post("/signUp",mainController.signUp)

router.get("/join",ensureLoggedIn,mainController.joinPage)
router.post("/join",mainController.joinSubmit)

router.get("/login",mainController.loginPage)
router.post("/login",passport.authenticate('local', {
    successRedirect: '/join',
    failureRedirect: '/login',
}))

router.get("/logout",mainController.logout)

module.exports = router;