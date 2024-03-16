// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index"); //I ADD THESE for the middleware
const invController = require("../controllers/invController");
const regValidate = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
//Route for an specific inventory item detail view
router.get("/detail/:invId", invController.buildByInvId); //WEEK 7

//Route for Management View
router.get("/", utilities.handleErrors(invController.buildManagement));

//Route for Add Classification View
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassificationView)
);
// Process data
router.post(
  "/classification-addition",
  //regValidate.AddingClassRules(),
  //regValidate.checkReggData,
  utilities.handleErrors(invController.addClassificationItem)
);

//Route for Add Inventory View
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventoryView)
);
router.post(
  "/inventory-addition",
  //regValidate.AddingInvRules(),
  //regValidate.checkRegData,
  utilities.handleErrors(invController.addInventoryItem)
);

module.exports = router;
