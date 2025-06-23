const router = require('express').Router()
const mainController = require('../controllers/mainController')



router.get("/",mainController.home)
router.post("/signUp",mainController.signUp)

module.exports = router;