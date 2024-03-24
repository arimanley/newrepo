const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();

  //let grid= await utilities.buildLoginView()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,

    // grid
  });
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 * 1000 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

/* ****************************************
 *  Function to Deliver register view
 * *************************************** */
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav();
  //let grid= await utilities.buildRegistrationView()
  res.render("account/registration", {
    title: "Registration",
    nav,
    errors: null,
    //grid
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;
  // Hash the password before storing
  let hashedPassword;
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/registration", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/registration", {
      title: "Registration",
      nav,
    });
  }
}

/* ****************************************
 *  Function to Deliver the Account Management view
 * ****************************************/
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/accountmanagement", {
    title: "Account Management",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Function to deliver the Update Account View
 * *************************************** */
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/updateview", {
    title: "Update Account",
    nav,
    errors: null,
  });
}

/* ****************************************
 * Updating Account Process
 * *************************************** */
async function updateAccount (req, res, next) {
  //console.log("Insert Inventory");
  let nav = await utilities.getNav();

  const {account_id ,account_firstname, account_lastname, account_email} = req.body;

  const updatedAccount = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email,
  );

  if (updatedAccount) {
    req.flash("notice", ` Was successfully updated.`);
    res.status(201).render("account/management", {
      title: "Management",
      nav,
    });
   // res.redirect("account/management");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("account/updateview", {
      title: "Update Account View ",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    });
  }
};

module.exports = {
  buildLogin,
  buildRegistration,
  registerAccount,
  accountLogin,
  buildAccountManagement,
  buildUpdateAccount,
  updateAccount
};
