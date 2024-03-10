const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
const invCont = {}


/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build Dropdown (not working have no idea why)
 * ************************** */
invCont.buildDropDown = async function (req, res, next) {
  const classification_name = req.classificationname;
  const data = await invModel.getClassifications(classification_name);
  const dropDown = await utilities.getNav(data);
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/add-inventory", {
    title: className ,
    nav,
  dropDown
  })
};


//a controller function
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId
  const data = await invModel.getInventoryByInvId(inv_id)
  const grid = await utilities.buildVehicleDetailsHTML(data)
  let nav = await utilities.getNav()
  const className = data[0].inv_make + data[0].inv_model
  res.render("./inventory/vehiclesdetails", {
    title: className + " vehicles",
    nav,
    grid,
  })

}
/* ****************************************
*  Function to Deliver Management view
* *************************************** */
invCont.buildManagement = async function (req, res, next) {
  //const classification_name = req.params.classificationName
  //const data = await invModel.getClassificationName()
  let nav = await utilities.getNav()
  //let grid = await utilities.buildManagementView(data)
  res.render("./inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
   //grid
  })
}
/* ****************************************
*  Function to Deliver Add Classification view
* *************************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Function to Deliver Add Inventory view
* *************************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
  })
}

  /* ****************************************
*Adding Classification Process
* *************************************** */
 invCont.addClassificationItem=async function(req, res) {
  let nav = await utilities.getNav()
  const {classification_name} = req.body

  const regResult = await inventoryModel.classificationItem(
    classification_name
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you added a new classification`
    )
    res.status(201).render("./inventory/management", {
      title: "View Management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the Classification failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
    })
  }
}
 /* ****************************************
*  Process Registration
* *************************************** */
 invCont.addInventoryItem= async function(req, res) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail,inv_price,inv_year,inv_miles,inv_color } = req.body


  const regResult = await inventoryModel.inventoryItem( //maccountModel.registerAccount
    inv_make, inv_model, inv_description, inv_image, inv_thumbnail,inv_price,inv_year,inv_miles,inv_color
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you added a new inventory item`
    )
    res.status(201).render("./inventory/management", {
      title: "View management",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the inventory addition failed.")
    res.status(501).render("./inventory/add-inventory", {
      title: "Add Inventory",
      nav,
     
    })
  }
}


module.exports = invCont

