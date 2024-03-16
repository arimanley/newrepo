const invModel = require("../models/inventory-model")
const Util = {}
const { body, validationResult } = require("express-validator")
const validate = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* ************************
 * Constructs the dropdown of the form 
 ************************** */
Util.getDrop = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let dropdown = '<select id="classificationList">';

 data.rows.forEach((row) => {
   dropdown +=
      '<option value="' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
     row.classification_name +
      '</option>';
  });

 dropdown += '</select>';
  return dropdown;
}

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}
/*
Util.buildClassificationList = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let dropdown = '<select id="navigationDropdown">';
  dropdown += '<option value="/" title="Home page">Home</option>';

 data.rows.forEach((row) => {
   dropdown +=
      '<option value="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
     row.classification_name +
      '</option>';
  });

 dropdown += '</select>';
  return dropdown;
}*/

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
 * Build HTML for a single vehicle view 
 * ************************************  */
Util.buildVehicleDetailsHTML = async function(data){
  try{
    if(data){
      let grid= `<div class="grid-container">
      <div class="left-side">
      <h2> ${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model} </h2>
      <img src="${data[0].inv_image}" alt="${data[0].inv_make} ${data[0].inv_model}">  
      </div>
      <div class="right-side">
      <h3>  ${data[0].inv_make} ${data[0].inv_model} Details </h3>
      <p>Price: $${new Intl.NumberFormat('en-US').format(data[0].inv_price)}</p>
      <p> Description: ${data[0].inv_description} </p>
      <p> Mileage:${new Intl.NumberFormat('en-US').format(data[0].inv_miles)} </p>
      <p> Color: ${data[0].inv_color} </p>
      </div>
      </div>`;
      return grid;}
      else{
        return `<p> Sorry </p>`;
      }
    } catch (error){
      console.error("error", error);
      return `<p> Sorry </p>`;
    }
  };


 
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }


 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }
module.exports = Util

//module.exports = validate