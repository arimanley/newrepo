const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

//a controller function
invCont.buildByInvId = async function (req, res, next) {
  const inv_id = req.params.invId;
  const data = await invModel.getInventoryByInvId(inv_id);
  const grid = await utilities.buildVehicleDetailsHTML(data);
  let nav = await utilities.getNav();
  const className = data[0].inv_make + data[0].inv_model;
  res.render("./inventory/vehiclesdetails", {
    title: className + " vehicles",
    nav,
    grid,
  });
};
/* ****************************************
 *  Function to Deliver Management view
 * *************************************** */
invCont.buildManagement = async function (req, res, next) {
  //const classification_name = req.params.classificationName
  let nav = await utilities.getNav();
  const data = await invModel.getInventoryByClassificationId();
  //const classificationSelect = await utilities.getDrop();
  const classificationSelect = await utilities.buildClassificationList();
  //const classificationSelect = await utilities.buildClassificationList(data)
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,

    //grid
  });
};
/* ****************************************
 *  Function to Deliver Add Classification view
 * *************************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  });
};

/* ****************************************
 *  Function to Deliver Add Inventory view
 * *************************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList=await utilities.buildClassificationList()
  //let dropdown = await utilities.getDrop();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    //dropdown,
    errors: null,
  });
};

/* ****************************************
 *Adding Classification ro database
 * *************************************** */
invCont.addClassificationItem = async function (req, res, next) {
  console.log("Insert classification");

  const { classification_name } = req.body

  const result = await invModel.classificationItem(classification_name);

  let nav = await utilities.getNav();

  if (result) {
    req.flash("notice",
     `Classification ${classification_name}was succesfully added`)

    res.status(201).render("inventory/management", {
      title: "View Management",
      nav,
      errors:null,
    });
  } else {
    req.flash("notice", "Sorry, the Classification failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors:null,
    })
  }
}

/* ****************************************
 *  Adding Inventory Process
 * *************************************** */
invCont.addInventoryItem = async function (req, res, next) {
  //console.log("Insert Inventory");
  let nav = await utilities.getNav();

  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  } = req.body

  const result = await invModel.inventoryItem(
    //maccountModel.registerAccount
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color
  )

  if (result) {
    req.flash(
      "notice",
       `Vehicle ${inv_make} ${inv_model} was successfully added`
       )
    res.status(201).render("inventory/management", {
      title: "View management",
      nav,
      errors:null,
    })
  } else {
    req.flash("notice", "Sorry, the inventory addition failed.");
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

module.exports = invCont;
