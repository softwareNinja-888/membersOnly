const router = require('express').Router()
const mainController = require('../controllers/mainController')
const passport = require('passport')

function ensureLoggedIn(req,res,next){
    if (req.isAuthenticated()) return next();
    res.redirect('/login')

}

router.get("/",mainController.home)
router.get("/signUp",mainController.signUpPage)
router.post("/signUp",mainController.signUp)

router.get("/join",ensureLoggedIn,mainController.joinPage)
router.post("/join",ensureLoggedIn,mainController.joinSubmit)

router.get("/login",mainController.loginPage)
router.post("/login",passport.authenticate('local', {
    successRedirect: '/join',
    failureRedirect: '/login',
    failureFlash: true
}))

router.get("/logout",ensureLoggedIn,mainController.logout)

module.exports = router;