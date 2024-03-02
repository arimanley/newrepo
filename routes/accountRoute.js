// Access to Needed Resources
const express = require("express")
const router = new express.Router() 
const utilities = require('../utilities/index'); 
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

//Quedamos en  Add a "GET" route for the path that will be sent when the "My Account" link is clicked.
router.get('/login', utilities.handleErrors(accountController.buildLogin));
// Process the login attempt
router.post('/login', regValidate.loginRules(),
regValidate.checkLoginData,
    (req, res) => {
      res.status(200).send('login process')
    }
)
  
//add a new route a registration route 
router.get('/registration', utilities.handleErrors(accountController.buildRegistration));
//enable the registration route
router.post('/register-user',  regValidate.registationRules(),
regValidate.checkRegData,utilities.handleErrors(accountController.registerAccount));


module.exports=router;

