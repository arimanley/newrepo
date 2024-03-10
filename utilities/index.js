const invModel = require("../models/inventory-model")
const Util = {}
const { body, validationResult } = require("express-validator")
const validate = {}


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
 * Constructs the dropdown of the form (NOT WORKING with the .getDrop, just with .getNav but that affect my navigation bar)
 ************************** */
Util.getDrop = async function (req, res, next) {
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
}
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


module.exports = Util

//module.exports = validate