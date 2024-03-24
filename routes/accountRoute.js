// Access to Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

//Quedamos en  Add a "GET" route for the path that will be sent when the "My Account" link is clicked.
router.get("/login", utilities.handleErrors(accountController.buildLogin));
// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
  // (req, res) => {
  // res.status(200).send('login process')
  //}
);

//add a new route a registration route
router.get(
  "/registration",
  utilities.handleErrors(accountController.buildRegistration)
);
//enable the registration route
router.post(
  "/register-user",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

//add a new route a account management route
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Route to deliver the Update Account View
router.get(
  "/updateview",
  utilities.handleErrors(accountController.buildUpdateAccount)
);
// Route for upddate view from the form
router.post(
  "/update/",
  //validate.updateRules(),
//validate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);



module.exports = router;
