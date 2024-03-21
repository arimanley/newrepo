// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/index"); //I ADD THESE for the middleware
const invController = require("../controllers/invController");
const validate = require("../utilities/inventory-validation");

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
  validate.AddingClassRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassificationItem)
);


//Route for Add Inventory View
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventoryView)
);
router.post(
  "/inventory-addition",
  validate.AddingInvRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventoryItem)
);




router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route for editing inventory item(modify link)
router.get('/edit/:inv_id', utilities.handleErrors(invController.editInventoryView))

// Route for updta view from the form
router.post("/update/", 
//validate.AddingInvRules(),
validate.checkUpdateData,
utilities.handleErrors(invController.updateInventory))


// Route for deleting inventory item(delete link)
router.get('/delete/:inv_id', utilities.handleErrors(invController.deleteInventoryView))
// Route for handle the delete view from the form
router.post("/deleting/", 
//validate.AddingInvRules(),
//validate.checkUpdateData,
utilities.handleErrors(invController.deleteInventory))
module.exports = router;
