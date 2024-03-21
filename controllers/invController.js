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
  //const classificationSelect = await utilities.getDrop();
  //let classificationList =await utilities.buildClassificationList()
  let classificationList = await utilities.buildClassificationList();
  res.render("inventory/management", {
    title: "Vehicle Management",
    nav,
    classificationList,
    errors: null,
    //grid
  });
};
/* ****************************************
 *  Function to Deliver Add Classification view
 * *************************************** */
invCont.buildAddClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    classificationList,
    errors: null,
  });
};

/* ****************************************
 *  Function to Deliver Add Inventory view
 * *************************************** */
invCont.buildAddInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
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
 *Adding Classification to database
 * *************************************** */
invCont.addClassificationItem = async function (req, res, next) {
  console.log("Insert classification");

  const { classification_name } = req.body;

  const result = await invModel.classificationItem(classification_name);

  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  if (result) {
    req.flash(
      "notice",
      `Classification ${classification_name}was succesfully added`
    );

    res.status(201).render("inventory/management", {
      title: "View Management",
      nav,
      classificationList,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the Classification failed.");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
};

/* ****************************************
 *  Adding Inventory Process
 * *************************************** */
invCont.addInventoryItem = async function (req, res, next) {
  //console.log("Insert Inventory");
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();

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
    inv_color,
  } = req.body;

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
  );

  if (result) {
    req.flash(
      "notice",
      `Vehicle ${inv_make} ${inv_model} was successfully added`
    );
    res.status(201).render("inventory/management", {
      title: "View management",
      nav,
      classificationList,
      errors: null,
    });
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

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInvId(inv_id);
  console.log(itemData);
  const classificationList = await utilities.buildClassificationList(
    itemData[0].classification_id
  );
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id,
  });
};

/* ****************************************
 * Updating Inventory Process
 * *************************************** */
invCont.updateInventory = async function (req, res, next) {
  //console.log("Insert Inventory");
  let nav = await utilities.getNav();

  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await invModel.updateInventory(
    //maccountModel.registerAccount
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    res.redirect("/inv/");
  } else {
    const classificationList = await utilities.buildClassificationList(
      classification_id
    );
    //const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Sorry, the insert failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList: classificationList,
      //classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};


/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const itemData = await invModel.getInventoryByInvId(inv_id);
  console.log(itemData);
  const classificationList = await utilities.buildClassificationList(
    itemData[0].classification_id
  );
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData[0].inv_id,
    inv_make: itemData[0].inv_make,
    inv_model: itemData[0].inv_model,
    inv_year: itemData[0].inv_year,
    inv_description: itemData[0].inv_description,
    inv_image: itemData[0].inv_image,
    inv_thumbnail: itemData[0].inv_thumbnail,
    inv_price: itemData[0].inv_price,
    inv_miles: itemData[0].inv_miles,
    inv_color: itemData[0].inv_color,
    classification_id: itemData[0].classification_id,
  });
};

/* ****************************************
 * Deleting Inventory Process
 * *************************************** */
invCont.deleteInventory = async function (req, res, next) {
  //console.log("Insert Inventory");
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventory(inv_id);

  const deleteSuccessful = deleteResult !== null;
  if (deleteSuccessful) {
    // If delete was successful, return flash message
    req.flash("notice", `The inventory item with ID ${inv_id} was successfully deleted.`);
    res.redirect("/inv/");
  } else {
    // If delete failed, return failure message
    req.flash("notice", "Sorry, the delete failed.");
    // Redirect to rebuild the delete view for the same inventory item
    res.redirect("./inventory/delete-confirm" + inv_id);
  }
};

module.exports = invCont;
